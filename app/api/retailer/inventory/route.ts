// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// /**
//  * ======================================
//  * GET → Fetch Retailer Inventory
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();

//     if (role !== "retailer") {
//       return NextResponse.json(
//         { error: "Access denied: Only retailers can view inventory." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const inventory = db.collection("retailer_inventory");

//     // ✅ Fetch only shipped (available) items for this retailer
//     const items = await inventory
//       .find({
//         ownerId: new ObjectId(user._id),
//         status: "available",
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json(items, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/retailer/inventory error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Add new item to Retailer Inventory
//  * (Triggered automatically when Distributor ships order)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "retailer") {
//       return NextResponse.json(
//         { error: "Only retailers can add inventory manually." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const {
//       productId,
//       productName,
//       supplierId,
//       supplierName,
//       batchNumber,
//       quantity,
//       unit,
//       pricePerUnit,
//       location,
//       status,
//     } = body;

//     if (!productId || !productName || !supplierId || !supplierName || !quantity) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");

//     const newItem = {
//       productId: new ObjectId(productId),
//       productName,
//       supplierId: new ObjectId(supplierId),
//       supplierName,
//       batchNumber: batchNumber || `BATCH-${Date.now()}`,
//       quantity: Number(quantity),
//       unit: unit || "unit",
//       pricePerUnit: Number(pricePerUnit) || 0,
//       location: location || "Retailer warehouse",
//       status: status || "pending", // becomes "available" when shipped
//       ownerId: new ObjectId(user._id),
//       ownerName: user.name,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await retailerInventory.insertOne(newItem);

//     return NextResponse.json(
//       {
//         message: "Item added to retailer inventory",
//         _id: result.insertedId,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/retailer/inventory error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// /**
//  * ======================================
//  * GET → Fetch Retailer Inventory
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "retailer") {
//       return NextResponse.json(
//         { error: "Access denied: Only retailers can view inventory." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const inventory = db.collection("retailer_inventory");

//     // ✅ Fetch only available (shipped) items for this retailer
//     const items = await inventory
//       .find({
//         ownerId: new ObjectId(user._id),
//         status: "available",
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json(items, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/retailer/inventory error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Add Item to Retailer Inventory
//  * (Triggered automatically when Distributor ships an order)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const {
//       productId,
//       productName,
//       supplierId,
//       supplierName,
//       batchNumber,
//       quantity,
//       unit,
//       pricePerUnit,
//       location,
//       status,
//       ownerId,
//       ownerName,
//     } = body;

//     // ✅ Validate required fields
//     if (!productId || !productName || !supplierId || !supplierName || !quantity || !ownerId || !ownerName) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");

//     const newItem = {
//       productId: new ObjectId(productId),
//       productName,
//       supplierId: new ObjectId(supplierId),
//       supplierName,
//       batchNumber: batchNumber || `BATCH-${Date.now()}`,
//       quantity: Number(quantity),
//       unit: unit || "unit",
//       pricePerUnit: Number(pricePerUnit) || 0,
//       location: location || "Retailer warehouse",
//       status: status || "pending", // ✅ updated to available when shipped
//       ownerId: new ObjectId(ownerId),
//       ownerName,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await retailerInventory.insertOne(newItem);

//     return NextResponse.json(
//       {
//         message: "Item added to retailer inventory",
//         _id: result.insertedId,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/retailer/inventory error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

/**
 * ======================================
 * GET → Fetch Retailer Inventory
 * ======================================
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "retailer") {
      return NextResponse.json(
        { error: "Access denied: Only retailers can view inventory." },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const retailerInventory = db.collection("retailer_inventory");

    // ✅ Fetch only items that have been shipped (available)
    const items = await retailerInventory
      .find({
        ownerId: new ObjectId(user._id),
        status: { $in: ["available", "shipped"] }, // only shipped items
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/retailer/inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * ======================================
 * POST → Add Item to Retailer Inventory
 * (Triggered automatically when Distributor ships an order)
 * ======================================
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId,
      productName,
      supplierId,
      supplierName,
      batchNumber,
      quantity,
      unit,
      pricePerUnit,
      location,
      status,
      ownerId,
      ownerName,
    } = body;

    // ✅ Validate required fields
    if (
      !productId ||
      !productName ||
      !supplierId ||
      !supplierName ||
      !quantity ||
      !ownerId ||
      !ownerName
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const retailerInventory = db.collection("retailer_inventory");

    const newItem = {
      productId: new ObjectId(productId),
      productName,
      supplierId: new ObjectId(supplierId),
      supplierName,
      batchNumber: batchNumber || `BATCH-${Date.now()}`,
      quantity: Number(quantity),
      unit: unit || "unit",
      pricePerUnit: Number(pricePerUnit) || 0,
      location: location || "Retailer warehouse",
      status: status || "pending", // changed to "available" after shipment
      ownerId: new ObjectId(ownerId),
      ownerName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await retailerInventory.insertOne(newItem);

    return NextResponse.json(
      {
        message: "✅ Item added to retailer inventory successfully",
        _id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/retailer/inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
