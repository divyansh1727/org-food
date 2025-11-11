// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";

// /**
//  * GET → Fetch available retailer products for customers
//  * Shows products in customer dashboard catalog
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");

//     // ✅ Get all products that are available
//     const products = await retailerInventory
//       .find({ status: "available" })
//       .project({
//         _id: 1,
//         productName: 1,
//         pricePerUnit: 1,
//         quantity: 1,
//         unit: 1,
//         ownerName: 1,
//         status: 1,
//         trustScore: 1,
//       })
//       .toArray();

//     return NextResponse.json({ products }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/customer/products error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

/**
 * GET → Fetch available retailer products for customers
 * Shows products in customer dashboard catalog
 */
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const retailerInventory = db.collection("retailer_inventory");

    // ✅ Get all available products (include productId field for tracing)
    const products = await retailerInventory
      .find({ status: "available" })
      .project({
        _id: 1,
        productId: 1, // ✅ include original productId for blockchain tracing
        productName: 1,
        pricePerUnit: 1,
        quantity: 1,
        unit: 1,
        ownerName: 1,
        status: 1,
        trustScore: 1,
      })
      .toArray();

    console.log("🧩 Example product from retailer:", products[0]); // Debug log

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/customer/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
