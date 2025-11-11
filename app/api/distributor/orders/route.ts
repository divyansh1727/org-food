// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";

// /**
//  * Get a single order by ID (no dashboard filtering)
//  */
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success) {
//       return NextResponse.json({ error: auth.error }, { status: 401 });
//     }

//     const { id } = params;
//     const db = await getDatabase();
//     const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json({ order });
//   } catch (error) {
//     console.error("Error fetching order by ID:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth } from "@/lib/auth";

/**
 * ==========================================
 * GET → Fetch all orders related to Distributor
 * ==========================================
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    const db = await getDatabase();
    const orders = db.collection("orders");

    const userId = new ObjectId(user._id);

    // ✅ Distributor can see both buy and sell side orders
    const distributorOrders = await orders
      .find({
        $or: [
          { buyerId: userId, buyerRole: "distributor" },
          { sellerId: userId, sellerRole: "distributor" },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(distributorOrders, { status: 200 });
  } catch (error) {
    console.error("GET /api/distributor/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

