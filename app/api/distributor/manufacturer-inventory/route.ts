// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// /**
//  * ======================================
//  * GET → Fetch Distributor Inventory
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();

//     if (role !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can view this inventory." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const inventory = db.collection("distributor_inventory");

//     const items = await inventory
//       .find({ ownerId: new ObjectId(user._id) })
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json(items, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/distributor/inventory error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Add Item (Optional Admin Use)
//  * ======================================
//  * In normal flow, this is handled automatically when
//  * a distributor purchases from a manufacturer.
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();

//     if (role !== "distributor") {
//       return NextResponse.json(
//         { error: "Only distributors can add inventory manually." },
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
//     } = body;

//     if (!productId || !productName || !supplierId || !supplierName || !quantity) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const distributorInventory = db.collection("distributor_inventory");

//     const item = {
//       productId: new ObjectId(productId),
//       productName,
//       supplierId: new ObjectId(supplierId),
//       supplierName,
//       batchNumber: batchNumber || `BATCH-${Date.now()}`,
//       quantity: Number(quantity),
//       unit: unit || "unit",
//       pricePerUnit: Number(pricePerUnit) || 0,
//       location: location || "Distributor warehouse",
//       status: "available",
//       ownerId: new ObjectId(user._id),
//       ownerName: user.name,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await distributorInventory.insertOne(item);

//     return NextResponse.json(
//       { message: "Item added to distributor inventory", _id: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/distributor/inventory error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// // }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// /**
//  * ======================================
//  * GET → Fetch Distributor Inventory (only shipped items)
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can view this inventory." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const inventory = db.collection("distributor_inventory");

//     // 🔹 Only show available (shipped) products
//     const items = await inventory
//       .find({
//         ownerId: new ObjectId(user._id),
//         status: "available",
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json(items, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/distributor/inventory error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// /**
//  * ==========================================
//  * GET → Fetch available products from Manufacturer Inventory
//  * (Visible to Distributor)
//  * ==========================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     // ✅ Verify authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can view manufacturer products." },
//         { status: 403 }
//       );
//     }

//     // ✅ Connect to database
//     const db = await getDatabase();
//     const manufacturerInventory = db.collection("manufacturer_inventory");

//     // ✅ Fetch only "available" items with positive quantity
//     const items = await manufacturerInventory
//       .find({ status: "available", quantity: { $gt: 0 } })
//       .sort({ createdAt: -1 })
//       .toArray();

//     // ✅ Format output for frontend clarity
//     const products = items.map((item) => ({
//       _id: item._id,
//       productId: item.productId,
//       productName: item.productName || "Unnamed Product",
//       supplierId: item.supplierId,
//       supplierName: item.supplierName,
//       batchNumber: item.batchNumber,
//       quantity: item.quantity,
//       unit: item.unit || "unit",
//       pricePerUnit: item.pricePerUnit || 0,
//       location: item.location || "Manufacturer warehouse",
//       status: item.status,
//       createdAt: item.createdAt,
//     }));

//     return NextResponse.json({ products }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/distributor/manufacturer-inventory error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";

/**
 * ==========================================
 * GET → Fetch available products from Manufacturer Inventory
 * (Visible to Distributor)
 * ==========================================
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "distributor") {
      return NextResponse.json(
        { error: "Access denied: Only distributors can view manufacturer products." },
        { status: 403 }
      );
    }

    // ✅ Connect to database
    const db = await getDatabase();
    const manufacturerInventory = db.collection("manufacturer_inventory");

    // ✅ Fetch only "available" items with positive quantity
    const items = await manufacturerInventory
      .find({ status: "available", quantity: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ Format output for frontend clarity
    const products = items.map((item) => ({
      _id: item._id,
      productId: item.productId,
      productName: item.productName || "Unnamed Product",
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      batchNumber: item.batchNumber,
      quantity: item.quantity,
      unit: item.unit || "unit",
      pricePerUnit: item.pricePerUnit || 0,
      location: item.location || "Manufacturer warehouse",
      status: item.status,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/distributor/manufacturer-inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";

// /**
//  * ==========================================
//  * GET → Fetch available products from Manufacturer Inventory
//  * (Visible to Distributor)
//  * ==========================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can view manufacturer products." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const manufacturerInventory = db.collection("manufacturer_inventory");

//     // ✅ Fetch available manufacturer items (with price > 0)
//     const items = await manufacturerInventory
//       .find({
//         status: "available",
//         quantity: { $gt: 0 },
//         pricePerUnit: { $exists: true },
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     const products = items.map((item) => ({
//       _id: item._id,
//       productId: item.productId,
//       productName: item.productName || "Unnamed Product",
//       supplierId: item.supplierId,
//       supplierName: item.supplierName,
//       batchNumber: item.batchNumber,
//       quantity: item.quantity,
//       unit: item.unit || "unit",
//       pricePerUnit: item.pricePerUnit || 0, // ✅ show price
//       location: item.location || "Manufacturer warehouse",
//       status: item.status,
//       createdAt: item.createdAt,
//     }));

//     return NextResponse.json({ products }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/distributor/manufacturer-inventory error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
