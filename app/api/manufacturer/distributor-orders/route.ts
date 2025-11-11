// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";
// import type { Order } from "@/lib/models/Order";

// export async function GET(request: NextRequest) {
//   try {
//     // ✅ 1. Verify Authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "manufacturer") {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     // ✅ 2. Connect to MongoDB
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     // ✅ 3. Manufacturer's ID (cast as ObjectId)
//     const manufacturerId = new ObjectId(String(user._id));

//     // ✅ 4. Build robust query to fetch distributor → manufacturer orders
//     const query: Record<string, any> = {
//       $or: [
//         {
//           buyerRole: "distributor",
//           sellerId: manufacturerId,
//           sellerRole: "manufacturer",
//         },
//         {
//           buyerRole: "distributor",
//           sellerId: manufacturerId,
//         },
//         {
//           buyerRole: "distributor",
//           sellerId: String(user._id), // Handle cases where sellerId is stored as string
//         },
//       ],
//     };

//     // ✅ 5. Optional status filtering
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     if (status) query.status = status;

//     // ✅ Debug info
//     console.log("🧩 Distributor-orders query:", JSON.stringify(query, null, 2));

//     // ✅ 6. Fetch orders safely
//     const distributorOrders = await ordersCollection
//       .find(query as any)
//       .sort({ createdAt: -1 })
//       .toArray();

//     console.log(
//       `📦 Distributor Orders API → Found: ${distributorOrders.length} for manufacturer: ${user.name}`
//     );

//     if (distributorOrders.length > 0) {
//       console.log("📄 Example order:", distributorOrders[0]);
//     }

//     // ✅ 7. Return the results
//     return NextResponse.json({ orders: distributorOrders });
//   } catch (error) {
//     console.error("❌ Distributor Orders API Error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import type { Order } from "@/lib/models/Order";

/* ======================================
   GET → Fetch Distributor Orders
====================================== */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user!;
    if (user.role.toLowerCase() !== "manufacturer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>("orders");

    const manufacturerId = new ObjectId(String(user._id));

    const query: Record<string, any> = {
      $or: [
        {
          buyerRole: "distributor",
          sellerId: manufacturerId,
          sellerRole: "manufacturer",
        },
        {
          buyerRole: "distributor",
          sellerId: manufacturerId,
        },
        {
          buyerRole: "distributor",
          sellerId: String(user._id),
        },
      ],
    };

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    if (status) query.status = status;

    const distributorOrders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders: distributorOrders });
  } catch (error) {
    console.error("❌ Distributor Orders API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ======================================
   PATCH → Mark Order as Shipped
   (Updates both the order and distributor inventory)
====================================== */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user!;
    if (user.role.toLowerCase() !== "manufacturer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const db = await getDatabase();
    const orders = db.collection<Order>("orders");
    const distributorInventory = db.collection("distributor_inventory");

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Step 1: Update order status → "shipped"
    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "shipped", updatedAt: new Date() } }
    );

    // ✅ Step 2: Try multiple ways to find distributor inventory
    const inventoryFilter = {
      $or: [
        {
          productId: new ObjectId(order.productId),
          ownerId: new ObjectId(order.buyerId),
        },
        {
          supplierId: new ObjectId(order.sellerId),
          ownerId: new ObjectId(order.buyerId),
          productName: order.productName,
        },
      ],
    };

    const updateResult = await distributorInventory.updateOne(inventoryFilter, {
      $set: { status: "available", updatedAt: new Date() },
    });

    console.log("📦 Inventory update result:", updateResult);

    if (updateResult.matchedCount === 0) {
      console.warn("⚠️ No distributor inventory matched for order:", order.orderNumber);
    } else {
      console.log(
        `✅ Distributor inventory updated → ${order.productName} now available`
      );
    }

    return NextResponse.json({
      message: "Order marked as shipped and inventory updated",
    });
  } catch (error) {
    console.error("❌ PATCH /api/manufacturer/distributor-order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
