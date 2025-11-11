import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Order } from "@/lib/models/Order";
import { ObjectId } from "mongodb";
import { verifyAuth } from "@/lib/auth";

// Utility — safely convert to ObjectId
function toObjectId(val: any) {
  try {
    if (!val) return null;
    if (val instanceof ObjectId) return val;
    return new ObjectId(String(val));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const db = await getDatabase();
    const orders = db.collection<Order>("orders");

    const query: any = {};

    // ✅ Role-based filtering
    switch (user.role) {
      case "farmer":
        query.sellerRole = "farmer";
        query.sellerId = toObjectId(user._id);
        break;

      case "manufacturer":
        query.$or = [
          { buyerId: toObjectId(user._id), buyerRole: "manufacturer" }, // farmer → manufacturer
          { sellerId: toObjectId(user._id), sellerRole: "manufacturer" }, // manufacturer → distributor
          { buyerRole: "distributor", sellerId: toObjectId(user._id) }, // distributor → manufacturer
        ];
        break;

      case "distributor":
        query.$or = [
          { buyerId: toObjectId(user._id), buyerRole: "distributor" },
          { sellerId: toObjectId(user._id), sellerRole: "distributor" },
        ];
        break;

      case "retailer":
        query.$or = [
          { buyerId: toObjectId(user._id), buyerRole: "retailer" },
          { sellerId: toObjectId(user._id), sellerRole: "retailer" },
        ];
        break;

      case "customer":
        query.buyerId = toObjectId(user._id);
        query.buyerRole = "customer";
        break;

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    if (status) query.status = status;

    console.log("GET /api/orders - user:", { id: user._id, role: user.role }, "query:", JSON.stringify(query));

    const result = await orders.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ orders: result });
  } catch (e) {
    console.error("Get orders error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;
    const { productId, quantity, shippingAddress } = await request.json();
    if (!productId || !quantity || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDatabase();
    const products = db.collection("products");
    const manufacturerInventory = db.collection("manufacturer_inventory");
    const orders = db.collection<Order>("orders");

    // Check where product exists
    let product: any = await products.findOne({ _id: new ObjectId(productId) });
    let fromManufacturer = false;

    if (!product) {
      product = await manufacturerInventory.findOne({ _id: new ObjectId(productId) });
      if (product) fromManufacturer = true;
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient quantity" }, { status: 400 });
    }

    // ✅ FIXED SELLER INFO LOGIC
    let sellerId: ObjectId | null = null;
    let sellerName = "";
    let sellerRole: Order["sellerRole"];

    if (fromManufacturer) {
      // product from manufacturer_inventory → manufacturer is the seller
      sellerId =
        toObjectId(product.supplierId) ||
        toObjectId(product.manufacturerId) ||
        toObjectId(product.ownerId);

      sellerName =
        product.supplierName ||
        product.manufacturerName ||
        product.ownerName ||
        "Manufacturer";

      sellerRole = "manufacturer";
    } else {
      // product from farmer → farmer is seller
      sellerId =
        toObjectId(product.farmerId) ||
        toObjectId(product.sellerId) ||
        toObjectId(product.ownerId);

      sellerName =
        product.farmerName ||
        product.ownerName ||
        "Farmer";

      sellerRole = "farmer";
    }

    if (!sellerId) {
      return NextResponse.json({ error: "Invalid seller info on product" }, { status: 500 });
    }

    const now = new Date();
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newOrder: Omit<Order, "_id"> = {
      orderNumber,
      buyerId: toObjectId(user._id)!,
      buyerName: user.name,
      buyerRole: user.role as Order["buyerRole"],
      sellerId,
      sellerName,
      sellerRole,
      productId: new ObjectId(String(productId)),
      productName: product.productName ?? product.name ?? "Product",
      quantity,
      unit: product.unit ?? "unit",
      pricePerUnit: Number(product.pricePerUnit) || 0,
      totalAmount: quantity * (Number(product.pricePerUnit) || 0),
      status: "pending",
      orderDate: now,
      shippingAddress,
      createdAt: now,
      updatedAt: now,
    };

    const result = await orders.insertOne(newOrder);

    // Update stock from the correct source
    const collection = fromManufacturer ? manufacturerInventory : products;
    await collection.updateOne(
      { _id: new ObjectId(String(productId)) },
      { $inc: { quantity: -quantity }, $set: { updatedAt: now } }
    );

    console.log("✅ POST /api/orders - Created Order:", {
      orderNumber,
      buyerRole: newOrder.buyerRole,
      sellerRole: newOrder.sellerRole,
      sellerId: String(newOrder.sellerId),
    });

    return NextResponse.json(
      { message: "Order created successfully", order: { ...newOrder, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (e) {
    console.error("Create order error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
