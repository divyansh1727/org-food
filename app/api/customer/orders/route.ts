// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";
// import type { Order } from "@/lib/models/Order";

// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "customer") {
//       return NextResponse.json(
//         { error: "Access denied: Only customers can view their orders." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");

//     const records = await orders
//       .find({
//         buyerId: new ObjectId(user._id),
//         buyerRole: "customer",
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders: records });
//   } catch (error) {
//     console.error("❌ GET /api/customer/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
      { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import type { Order } from "@/lib/models/Order";

/**
 * ======================================
 * GET → Fetch All Orders Placed by a Customer
 * ======================================
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Step 1: Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user!;
    const role = user.role.toLowerCase();

    // ✅ Step 2: Restrict to customers only
    if (role !== "customer") {
      return NextResponse.json(
        { error: "Access denied: Only customers can view their orders." },
        { status: 403 }
      );
    }

    // ✅ Step 3: Connect to database
    const db = await getDatabase();
    const ordersCollection = db.collection<Order>("orders");

    // ✅ Step 4: Fetch all customer orders
    const orders = await ordersCollection
      .find({
        buyerId: new ObjectId(user._id),
        buyerRole: "customer",
      })
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ Step 5: Return orders
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/customer/orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
