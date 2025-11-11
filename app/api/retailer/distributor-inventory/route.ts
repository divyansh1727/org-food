// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";

// /**
//  * GET → Fetch available distributor inventory for retailers to view
//  */
// export async function GET(req: NextRequest) {
//   try {
//     const db = await getDatabase();
//     const distributorInventory = db.collection("distributor_inventory");

//     // ✅ Fetch only available items
//     const availableProducts = await distributorInventory
//       .find({ status: "available" })
//       .project({
//         _id: 1,
//         productName: 1,
//         supplierName: 1,
//         quantity: 1,
//         unit: 1,
//         pricePerUnit: 1,
//         batchNumber: 1,
//         location: 1,
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ products: availableProducts }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/retailer/distributor-inventory error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch distributor products" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

/**
 * ======================================
 * GET → Retailer fetches Distributor Inventory
 * ======================================
 */
export async function GET() {
  try {
    const db = await getDatabase();
    const distributorInventory = db.collection("distributor_inventory");

    // ✅ Only return items that are available for retailers to order
    const products = await distributorInventory
      .find({ status: "available" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/retailer/distributor-inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
