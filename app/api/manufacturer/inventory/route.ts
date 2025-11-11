import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

interface ManufacturerInventoryItem {
  _id?: ObjectId;
  productId: ObjectId;
  productName: string;
  supplierId: ObjectId;      // Farmer id
  supplierName: string;      // Farmer name
  batchNumber: string;
  quantity: number;
  unit: string;
  location: string;
  status: "available" | "reserved" | "sold" | "expired";
  ownerId: ObjectId;         // Manufacturer id
  ownerName: string;         // Manufacturer name
  ownerRole?: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ======================================
   GET → Fetch manufacturer inventory
====================================== */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = authResult.user;
    const db = await getDatabase();
    const collection = db.collection<ManufacturerInventoryItem>("manufacturer_inventory");

    let filter: Record<string, any> = {};

    if (user.role === "manufacturer") {
      // ✅ Manufacturer sees only their own inventory
      filter = { ownerId: new ObjectId(user._id) };
    } else if (user.role === "distributor") {
      // ✅ Distributor sees only manufacturer-owned items (not their own)
      filter = {
        status: "available",
        ownerRole: "manufacturer",
        ownerId: { $ne: new ObjectId(user._id) },
      };
    } else {
      // Other roles not allowed
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch items
    const items = await collection.find(filter).sort({ createdAt: -1 }).toArray();

    // ✅ Deduplicate same product batches (merge by productName + ownerId)
    const merged: Record<string, ManufacturerInventoryItem> = {};
    for (const item of items) {
      const key = `${item.productName}_${item.ownerId.toString()}`;
      if (!merged[key]) {
        merged[key] = { ...item };
      } else {
        merged[key].quantity += item.quantity;
      }
    }

    const cleanInventory = Object.values(merged);

    return NextResponse.json(cleanInventory);
  } catch (err) {
    console.error("Manufacturer inventory GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ======================================
   POST → Add new product to manufacturer inventory
   (called when manufacturer buys from farmer)
====================================== */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = authResult.user;
    if (user.role !== "manufacturer") {
      return NextResponse.json(
        { error: "Only manufacturers can add products to inventory" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { productId, productName, supplierId, supplierName, quantity, unit, location, batchNumber } = data;

    if (!productId || !productName || !supplierId || !supplierName || !quantity || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDatabase();
    const inventoryCollection = db.collection<ManufacturerInventoryItem>("manufacturer_inventory");

    const now = new Date();

    // ✅ Check if manufacturer already has this product
    const existing = await inventoryCollection.findOne({
      productName,
      ownerId: new ObjectId(user._id),
      status: "available",
    });

    if (existing) {
      // ✅ Update existing inventory instead of creating a duplicate
      await inventoryCollection.updateOne(
        { _id: existing._id },
        {
          $inc: { quantity: Number(quantity) },
          $set: { updatedAt: now },
        }
      );

      console.log(`♻️ Updated existing batch for ${productName} (owner: ${user.name})`);

      return NextResponse.json(
        { message: "Existing inventory updated", updatedItem: existing },
        { status: 200 }
      );
    }

    // ✅ Create a new item
    const newItem: ManufacturerInventoryItem = {
      productId: new ObjectId(productId),
      productName,
      supplierId: new ObjectId(supplierId),
      supplierName,
      batchNumber: batchNumber || `BATCH-${Date.now()}`,
      quantity: Number(quantity),
      unit,
      location: location || "Manufacturer warehouse",
      status: "available",
      ownerId: new ObjectId(user._id),
      ownerName: user.name,
      ownerRole: "manufacturer",
      createdAt: now,
      updatedAt: now,
    };

    const result = await inventoryCollection.insertOne(newItem);

    console.log(
      `✅ Created manufacturer inventory: ${productName} from ${supplierName} → owned by ${user.name}`
    );

    return NextResponse.json(
      {
        message: "Inventory item added successfully",
        item: { ...newItem, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Manufacturer inventory POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

