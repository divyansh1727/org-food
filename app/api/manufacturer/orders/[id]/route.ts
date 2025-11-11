import { addTraceabilityRecord ,getProductJourney} from "@/lib/services/traceability-service";
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Order } from "@/lib/models/Order";
import type { Product } from "@/lib/models/Product";
import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
import { ObjectId } from "mongodb";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = authResult.user;
    const orderId = params.id;

    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const { status } = (await request.json()) as { status: Order["status"] };
    const valid: Order["status"][] = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = await getDatabase();
    const orders = db.collection<Order>("orders");
    const products = db.collection<Product>("products");

    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const userId = new ObjectId(String(user._id));

    const isSeller = order.sellerId.toString() === userId.toString();
    const isBuyer = order.buyerId.toString() === userId.toString();

    if (!isSeller && !isBuyer) {
      return NextResponse.json(
        { error: "Not authorized to update this order" },
        { status: 403 }
      );
    }

    // Seller rule
    if (isSeller) {
      if (
        !["confirmed", "shipped", "cancelled"].includes(status) &&
        status !== order.status
      ) {
        return NextResponse.json(
          { error: "Farmers can only confirm, ship or cancel orders" },
          { status: 403 }
        );
      }
    }

    // Buyer rule
    if (isBuyer) {
      if (status !== "cancelled") {
        return NextResponse.json(
          { error: "Buyers can only cancel orders" },
          { status: 403 }
        );
      }
      if (order.status !== "pending") {
        return NextResponse.json(
          { error: "Cannot cancel an order that is not pending" },
          { status: 400 }
        );
      }
    }

    const now = new Date();

    const update: Partial<Order> = {
      status,
      updatedAt: now,
    };

    if (status === "delivered") {
      update.actualDeliveryDate = now;
    }

    // Restock if cancelled
    if (status === "cancelled" && order.status === "pending") {
      await products.updateOne(
        { _id: new ObjectId(order.productId) },
        {
          $inc: { quantity: order.quantity },
          $set: { updatedAt: now, status: "available" },
        }
      );
    }

    await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

    // ----------------------------------
    //  FIX 1: SAFE SHIPPING ADDRESS
    // ----------------------------------
    const address = order.shippingAddress ?? {
      city: "Unknown",
      street: "",
      state: "",
      country: "",
    };

    // ----------------------------------
    // FIX 2: CORRECT TRACEABILITY STAGE
    // ----------------------------------
    let stage: TraceabilityRecord["stage"] = "farm";
    let description = "";

    switch (status) {
      case "confirmed":
        stage = "processing";
        description = "Order confirmed by seller";
        break;
      case "shipped":
        stage = "distribution";
        description = "Order shipped from seller";
        break;
      case "delivered":
        stage = "retail";
        description = "Order delivered to buyer";
        break;
      case "cancelled":
        stage = "farm";
        description = "Order cancelled";
        break;
    }

    // ----------------------------------
    // ADD TRACEABILITY RECORD
    // ----------------------------------
    await addTraceabilityRecord({
      productId: order.productId,
      orderId: order._id!,
      stage,
      actorId: userId,
      actorName: user.name,
      actorRole: user.role, // correct role
      location: {
        name: address.city,
        address: `${address.street}, ${address.state}, ${address.country}`,
      },
      action: status,
      description,
      verificationStatus: "pending",
    });

    return NextResponse.json({
      message: "Order status updated & traceability recorded",
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
