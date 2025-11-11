// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId)) {
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
//     }

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer) {
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );
//     }

//     // ✅ Validate allowed transitions per role
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled") {
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       }
//       if (order.status !== "pending") {
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//       }
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ If cancelled, restore product quantity
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     // ✅ Add shipped items to manufacturer inventory (farmer → manufacturer)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       const manufacturerInventory = db.collection("manufacturer_inventory");
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // ✅ Add traceability record
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }













// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId)) {
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
//     }

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer) {
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );
//     }

//     // ✅ Validate allowed transitions per role
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled") {
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       }
//       if (order.status !== "pending") {
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//       }
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ If cancelled, restore product quantity
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY UPDATES
//      */

//     // Farmer → Manufacturer (already in your code)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // ✅ Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       // 1️⃣ Check if the distributor already has this item
//       const existingItem = await distributorInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingItem) {
//         // 2️⃣ Update its status to available
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           {
//             $set: {
//               status: "available",
//               updatedAt: now,
//             },
//           }
//         );
//       } else {
//         // 3️⃣ Otherwise, insert a new inventory item
//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     /**
//      * ✅ TRACEABILITY
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Role-based allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore quantity if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY UPDATES
//      */

//     // Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       const existingItem = await distributorInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingItem) {
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ✅ Distributor → Retailer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       const existingItem = await retailerInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingItem) {
//         await retailerInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     /**
//      * ✅ TRACEABILITY RECORD
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }






// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Role-based allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore quantity if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY SYNC — BASED ON ORDER FLOW
//      */

//     // Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: order.buyerId,
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       const existingItem = await distributorInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingItem) {
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // Distributor → Retailer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       const existingItem = await retailerInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingItem) {
//         await retailerInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     /**
//      * ✅ TRACEABILITY RECORD
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Restrict allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore quantity if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY SYNC
//      */

//     // Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: order.buyerId,
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//  // ✅ Manufacturer → Distributor
// // ✅ Manufacturer → Distributor
// if (
//   status === "shipped" &&
//   order.sellerRole === "manufacturer" &&
//   order.buyerRole === "distributor"
// ) {
//   console.log("🚚 Shipping from manufacturer to distributor...");

//   const distributorId = new ObjectId(order.buyerId);
//   const productId = new ObjectId(order.productId);

//   // 🧽 Normalize statuses before updating
//   await distributorInventory.updateMany(
//     { ownerId: distributorId, productId },
//     [
//       {
//         $set: {
//           status: {
//             $toLower: { $trim: { input: "$status" } },
//           },
//         },
//       },
//     ]
//   );
//   console.log("🧽 Normalized all statuses for this product/distributor.");

//   // 🟢 Find the most recent record for this product/distributor
//   const existingItem = await distributorInventory.findOne(
//     { ownerId: distributorId, productId },
//     { sort: { createdAt: -1 } } // 👈 this ensures latest record is selected
//   );

//   if (existingItem) {
//     console.log(
//       `🟢 Found distributor item ${existingItem._id} (status: ${existingItem.status}) — setting to available.`
//     );

//     const updateResult = await distributorInventory.updateOne(
//       { _id: existingItem._id },
//       { $set: { status: "available", updatedAt: now } }
//     );

//     console.log("🧾 Update result:", updateResult);
//   } else {
//     console.log("🆕 No existing item found — inserting new record.");
//     await distributorInventory.insertOne({
//       productId,
//       productName: order.productName,
//       supplierId: new ObjectId(order.sellerId),
//       supplierName: order.sellerName,
//       batchNumber: `BATCH-${Date.now()}`,
//       quantity: order.quantity,
//       unit: order.unit,
//       pricePerUnit: order.pricePerUnit || 0,
//       location: "Distributor warehouse",
//       status: "available",
//       ownerId: distributorId,
//       ownerName: order.buyerName,
//       createdAt: now,
//       updatedAt: now,
//     });
//   }

//   // 🧹 Post-clean: ensure any “pending” entries for this product become available
//   const postClean = await distributorInventory.updateMany(
//     { ownerId: distributorId, productId, status: { $ne: "available" } },
//     { $set: { status: "available", updatedAt: now } }
//   );

//   console.log(`🧹 Final cleanup — fixed ${postClean.modifiedCount} records.`);
// }


// // Distributor → Retailer
// if (
//   status === "shipped" &&
//   order.sellerRole === "distributor" &&
//   order.buyerRole === "retailer"
// ) {
//   console.log("📦 Shipping from distributor to retailer...");

//   const retailerId =
//     typeof order.buyerId === "string"
//       ? new ObjectId(order.buyerId)
//       : order.buyerId;

//   const productId =
//     typeof order.productId === "string"
//       ? new ObjectId(order.productId)
//       : order.productId;

//   // Step 1: Try to find existing retailer item
//   const existingItem = await retailerInventory.findOne({
//     productId,
//     ownerId: retailerId,
//   });

//   if (existingItem) {
//     console.log(
//       `🟢 Found existing retailer item ${existingItem._id} (status: ${existingItem.status}). Updating to available.`
//     );
//     await retailerInventory.updateOne(
//       { _id: existingItem._id },
//       { $set: { status: "available", updatedAt: now } }
//     );
//   } else {
//     console.log("🆕 No existing retailer item found — inserting new one.");
//     await retailerInventory.insertOne({
//       productId,
//       productName: order.productName,
//       supplierId:
//         typeof order.sellerId === "string"
//           ? new ObjectId(order.sellerId)
//           : order.sellerId,
//       supplierName: order.sellerName,
//       batchNumber: `BATCH-${Date.now()}`,
//       quantity: order.quantity,
//       unit: order.unit,
//       pricePerUnit: order.pricePerUnit || 0,
//       location: "Retailer warehouse",
//       status: "available",
//       ownerId: retailerId,
//       ownerName: order.buyerName,
//       createdAt: now,
//       updatedAt: now,
//     });
//   }

//   // ✅ Step 2: Safety cleanup sync — force all related pending items to available
//   const cleanupResult = await retailerInventory.updateMany(
//     { ownerId: retailerId, productId, status: "pending" },
//     { $set: { status: "available", updatedAt: now } }
//   );
//   console.log(`🧹 Cleanup sync — fixed ${cleanupResult.modifiedCount} pending items.`);
// }


//     /**
//      * ✅ TRACEABILITY
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Restrict allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "delivered", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, deliver, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore product stock if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY SYNC (Farm → Manufacturer → Distributor → Retailer)
//      */
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: order.buyerId,
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // ✅ Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       const existingItem = await distributorInventory.findOne(
//         { ownerId: distributorId, productId },
//         { sort: { createdAt: -1 } }
//       );

//       if (existingItem) {
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ✅ Distributor → Retailer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       const retailerId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       const existingItem = await retailerInventory.findOne({
//         productId,
//         ownerId: retailerId,
//       });

//       if (existingItem) {
//         await retailerInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     /**
//      * ✅ NEW: Retailer → Customer (Final Step)
//      */
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("📦 Retailer shipped order to customer");
//       // no inventory creation; handled by logistics/traceability
//     }

//     if (
//       status === "delivered" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("✅ Order delivered to customer — final delivery stage");
//       // could add delivery confirmation logic here if needed
//     }

//     /**
//      * ✅ TRACEABILITY
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "delivered", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, deliver, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore quantity if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY SYNC LOGIC
//      */

//     // 🟢 Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: order.buyerId,
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // 🟡 Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       const existingItem = await distributorInventory.findOne(
//         { ownerId: distributorId, productId },
//         { sort: { createdAt: -1 } }
//       );

//       if (existingItem) {
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // 🔵 Distributor → Retailer (✅ FIXED)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       console.log("📦 Shipping from distributor to retailer...");

//       const retailerId =
//         typeof order.buyerId === "string"
//           ? new ObjectId(order.buyerId)
//           : order.buyerId;

//       const productId =
//         typeof order.productId === "string"
//           ? new ObjectId(order.productId)
//           : order.productId;

//       // 🧭 Step 1: Normalize pending entries for this product/retailer
//       const pendingItems = await retailerInventory
//         .find({ ownerId: retailerId, productId, status: { $ne: "available" } })
//         .toArray();

//       if (pendingItems.length > 0) {
//         console.log(`🟢 Found ${pendingItems.length} pending items, marking as available.`);
//         await retailerInventory.updateMany(
//           { ownerId: retailerId, productId },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         console.log("🆕 No pending items found — inserting new one.");
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }

//       console.log("✅ Retailer inventory synced successfully after shipment.");
//     }

//     // 🟣 Retailer → Customer (Final Delivery Step)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("📦 Retailer shipped order to customer (no inventory created).");
//     }

//     if (
//       status === "delivered" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("✅ Order delivered to customer — final delivery stage.");
//     }

//     /**
//      * ✅ TRACEABILITY RECORD
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "delivered", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, deliver, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore quantity if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY SYNC LOGIC
//      */

//     // 🟢 Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: order.productId,
//         productName: order.productName,
//         supplierId: order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         pricePerUnit: order.pricePerUnit || 0,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: order.buyerId,
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // 🟡 Manufacturer → Distributor (✅ price preserved)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       console.log("🚚 Shipping from manufacturer to distributor...");

//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       const existingItem = await distributorInventory.findOne(
//         { ownerId: distributorId, productId },
//         { sort: { createdAt: -1 } }
//       );

//       if (existingItem) {
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           {
//             $set: {
//               status: "available",
//               updatedAt: now,
//             },
//             $inc: { quantity: order.quantity },
//           }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }

//       console.log(
//         `✅ Distributor inventory updated with price ₹${order.pricePerUnit}`
//       );
//     }

//     // 🔵 Distributor → Retailer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       console.log("📦 Shipping from distributor to retailer...");

//       const retailerId =
//         typeof order.buyerId === "string"
//           ? new ObjectId(order.buyerId)
//           : order.buyerId;

//       const productId =
//         typeof order.productId === "string"
//           ? new ObjectId(order.productId)
//           : order.productId;

//       const pendingItems = await retailerInventory
//         .find({ ownerId: retailerId, productId, status: { $ne: "available" } })
//         .toArray();

//       if (pendingItems.length > 0) {
//         console.log(
//           `🟢 Found ${pendingItems.length} pending items, marking as available.`
//         );
//         await retailerInventory.updateMany(
//           { ownerId: retailerId, productId },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         console.log("🆕 No pending items found — inserting new one.");
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }

//       console.log("✅ Retailer inventory synced successfully after shipment.");
//     }

//     // 🟣 Retailer → Customer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("📦 Retailer shipped order to customer (no inventory created).");
//     }

//     if (
//       status === "delivered" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("✅ Order delivered to customer — final delivery stage.");
//     }

//     /**
//      * ✅ TRACEABILITY RECORD
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// // }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const { status } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Allowed transitions
//     if (isSeller) {
//       if (
//         !["confirmed", "shipped", "delivered", "cancelled"].includes(status) &&
//         status !== order.status
//       ) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, deliver, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json(
//           { error: "Buyers can only cancel orders" },
//           { status: 403 }
//         );
//       if (order.status !== "pending")
//         return NextResponse.json(
//           { error: "Only pending orders can be cancelled" },
//           { status: 400 }
//         );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ Restore quantity if cancelled
//     if (status === "cancelled" && order.status === "pending") {
//       await products.updateOne(
//         { _id: new ObjectId(order.productId) },
//         {
//           $inc: { quantity: order.quantity },
//           $set: { updatedAt: now, status: "available" },
//         }
//       );
//     }

//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * ✅ INVENTORY SYNC LOGIC
//      */

//     // 🟢 Farmer → Manufacturer
//     // if (
//     //   status === "shipped" &&
//     //   order.sellerRole === "farmer" &&
//     //   order.buyerRole === "manufacturer"
//     // ) {
//     //   await manufacturerInventory.insertOne({
//     //     productId: order.productId,
//     //     productName: order.productName,
//     //     supplierId: order.sellerId,
//     //     supplierName: order.sellerName,
//     //     batchNumber: `BATCH-${Date.now()}`,
//     //     quantity: order.quantity,
//     //     unit: order.unit,
//     //     pricePerUnit: order.pricePerUnit || 0,
//     //     location:
//     //       typeof order.shippingAddress === "object"
//     //         ? order.shippingAddress.city
//     //         : "Unknown",
//     //     status: "available",
//     //     ownerId: order.buyerId,
//     //     ownerName: order.buyerName,
//     //     createdAt: now,
//     //     updatedAt: now,
//     //   });
//     // }
//     // 🟢 Farmer → Manufacturer (✅ fixed: now includes pricePerUnit)
// if (
//   status === "shipped" &&
//   order.sellerRole === "farmer" &&
//   order.buyerRole === "manufacturer"
// ) {
//   await manufacturerInventory.insertOne({
//     productId: order.productId,
//     productName: order.productName,
//     supplierId: order.sellerId,
//     supplierName: order.sellerName,
//     batchNumber: `BATCH-${Date.now()}`,
//     quantity: order.quantity,
//     unit: order.unit,
//     pricePerUnit: order.pricePerUnit || 0, // ✅ preserve farmer’s selling price
//     location:
//       typeof order.shippingAddress === "object"
//         ? order.shippingAddress.city
//         : "Unknown",
//     status: "available",
//     ownerId: order.buyerId,
//     ownerName: order.buyerName,
//     createdAt: now,
//     updatedAt: now,
//   });
// }


//     // 🟡 Manufacturer → Distributor (✅ price preserved)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       console.log("🚚 Shipping from manufacturer to distributor...");

//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       const existingItem = await distributorInventory.findOne(
//         { ownerId: distributorId, productId },
//         { sort: { createdAt: -1 } }
//       );

//       if (existingItem) {
//         await distributorInventory.updateOne(
//           { _id: existingItem._id },
//           {
//             $set: {
//               status: "available",
//               updatedAt: now,
//             },
//             $inc: { quantity: order.quantity },
//           }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }

//       console.log(
//         `✅ Distributor inventory updated with price ₹${order.pricePerUnit}`
//       );
//     }

//     // 🔵 Distributor → Retailer (✅ price preserved)
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       console.log("📦 Shipping from distributor to retailer...");

//       const retailerId =
//         typeof order.buyerId === "string"
//           ? new ObjectId(order.buyerId)
//           : order.buyerId;

//       const productId =
//         typeof order.productId === "string"
//           ? new ObjectId(order.productId)
//           : order.productId;

//       const pendingItems = await retailerInventory
//         .find({ ownerId: retailerId, productId, status: { $ne: "available" } })
//         .toArray();

//       if (pendingItems.length > 0) {
//         console.log(
//           `🟢 Found ${pendingItems.length} pending items, marking as available.`
//         );
//         await retailerInventory.updateMany(
//           { ownerId: retailerId, productId },
//           { $set: { status: "available", updatedAt: now } }
//         );
//       } else {
//         console.log("🆕 No pending items found — inserting new one.");
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: order.pricePerUnit || 0, // ✅ Distributor’s selling price
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }

//       console.log(
//         `✅ Retailer inventory synced successfully with price ₹${order.pricePerUnit}`
//       );
//     }

//     // 🟣 Retailer → Customer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("📦 Retailer shipped order to customer (no inventory created).");
//     }

//     if (
//       status === "delivered" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("✅ Order delivered to customer — final delivery stage.");
//     }

//     /**
//      * ✅ TRACEABILITY RECORD
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  *
//  * Accepts body: { status: "confirmed" | "shipped" | "delivered" | "cancelled", pricePerUnit?: number }
//  * pricePerUnit is used when a seller ships to set their selling price into the downstream inventory.
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // auth
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     // allow pricePerUnit in the PATCH body so the current seller can set selling price when shipping
//     const { status, pricePerUnit } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json({ error: "Not authorized to update this order" }, { status: 403 });

//     // Allowed transitions:
//     // - Seller: confirm, ship, delivered (if allowed), cancel
//     // - Buyer: cancel (only when pending)
//     if (isSeller) {
//       if (!["confirmed", "shipped", "delivered", "cancelled"].includes(status) && status !== order.status) {
//         return NextResponse.json(
//           { error: "Sellers can only confirm, ship, deliver, or cancel orders" },
//           { status: 403 }
//         );
//       }
//     } else if (isBuyer) {
//       if (status !== "cancelled")
//         return NextResponse.json({ error: "Buyers can only cancel orders" }, { status: 403 });
//       if (order.status !== "pending")
//         return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };
//     if (status === "delivered") update.actualDeliveryDate = now;

//     // Restore product quantity if cancelled and order was pending (best-effort)
//     if (status === "cancelled" && order.status === "pending") {
//       try {
//         await products.updateOne(
//           { _id: new ObjectId(order.productId) },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { updatedAt: now, status: "available" },
//           }
//         );
//       } catch (e) {
//         console.error("Failed to restore product quantity on cancel:", e);
//       }
//     }

//     // persist order status update
//     await orders.updateOne({ _id: new ObjectId(orderId) }, { $set: update });

//     /**
//      * INVENTORY SYNC AND PRICING PROPAGATION
//      *
//      * We support a pricePerUnit passed in the PATCH body. Sellers should provide pricePerUnit
//      * when they ship to set the selling price for the buyer's inventory.
//      */

//     // ---------------------------
//     // Farmer -> Manufacturer (shipped)
//     // ---------------------------
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: typeof order.productId === "string" ? new ObjectId(order.productId) : order.productId,
//         productName: order.productName,
//         supplierId: typeof order.sellerId === "string" ? new ObjectId(order.sellerId) : order.sellerId,
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         pricePerUnit: pricePerUnit ?? order.pricePerUnit ?? 0, // keep any supplied price or fallback
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: typeof order.buyerId === "string" ? new ObjectId(order.buyerId) : order.buyerId,
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // ---------------------------
//     // Manufacturer -> Distributor (shipped)
//     // ---------------------------
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       console.log("🚚 Manufacturer → Distributor shipping logic");

//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       // 1) Decrease manufacturer inventory (reduce the specific batch if present)
//       try {
//         const manufacturerItem = await manufacturerInventory.findOne({
//           productId,
//           ownerId: new ObjectId(order.sellerId),
//         });
//         if (manufacturerItem) {
//           const newQty = Math.max(0, (manufacturerItem.quantity || 0) - order.quantity);
//           await manufacturerInventory.updateOne(
//             { _id: manufacturerItem._id },
//             { $set: { quantity: newQty, updatedAt: now, status: newQty <= 0 ? "out_of_stock" : manufacturerItem.status } }
//           );
//           console.log(`📉 Manufacturer item ${String(manufacturerItem._id)} reduced to ${newQty}`);
//         }
//       } catch (e) {
//         console.error("Failed to reduce manufacturer inventory:", e);
//       }

//       // 2) Determine selling price (manufacturer's chosen price when shipping)
//       const sellingPrice = typeof pricePerUnit === "number" ? Number(pricePerUnit) : Number(order.pricePerUnit ?? 0);

//       // 3) Add or update distributor inventory
//       const existing = await distributorInventory.findOne(
//         { ownerId: distributorId, productId },
//         { sort: { createdAt: -1 } }
//       );

//       if (existing) {
//         // update quantity and price (increment)
//         await distributorInventory.updateOne(
//           { _id: existing._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { status: "available", pricePerUnit: sellingPrice, updatedAt: now },
//           }
//         );
//         console.log(`🔁 Updated existing distributor item ${existing._id}, added qty ${order.quantity}, price ${sellingPrice}`);
//       } else {
//         // insert new batch entry for distributor
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: typeof order.sellerId === "string" ? new ObjectId(order.sellerId) : order.sellerId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//         console.log("➕ Inserted new distributor inventory with price:", sellingPrice);
//       }
//     }

//     // ---------------------------
//     // Distributor -> Retailer (shipped)
//     // ---------------------------
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       console.log("📦 Distributor → Retailer shipping logic");

//       const retailerId = typeof order.buyerId === "string" ? new ObjectId(order.buyerId) : order.buyerId;
//       const distributorId = typeof order.sellerId === "string" ? new ObjectId(order.sellerId) : order.sellerId;
//       const productId = typeof order.productId === "string" ? new ObjectId(order.productId) : order.productId;

//       // 1) Decrease distributor inventory: find appropriate batch(s) and decrement
//       try {
//         // Try to find a distributor inventory record for this owner and product
//         const distributorItem = await distributorInventory.findOne({
//           productId,
//           ownerId: distributorId,
//         });
//         if (distributorItem) {
//           const newQty = Math.max(0, (distributorItem.quantity || 0) - order.quantity);
//           await distributorInventory.updateOne(
//             { _id: distributorItem._id },
//             { $set: { quantity: newQty, updatedAt: now, status: newQty <= 0 ? "out_of_stock" : distributorItem.status } }
//           );
//           console.log(`📉 Distributor stock reduced to ${newQty} for item ${String(distributorItem._id)}`);
//         } else {
//           console.warn("No distributor inventory item found to deduct from");
//         }
//       } catch (e) {
//         console.error("Failed to reduce distributor inventory:", e);
//       }

//       // 2) Determine selling price (distributor's set price) — distributor should pass pricePerUnit in PATCH when shipping
//       const sellingPrice = typeof pricePerUnit === "number" ? Number(pricePerUnit) : Number(order.pricePerUnit ?? 0);

//       // 3) Upsert into retailer inventory
//       const existingRetail = await retailerInventory.findOne({
//         productId,
//         ownerId: retailerId,
//       });

//       if (existingRetail) {
//         // If retailer already has the product, increase quantity and set available
//         await retailerInventory.updateOne(
//           { _id: existingRetail._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { status: "available", pricePerUnit: sellingPrice, updatedAt: now },
//           }
//         );
//         console.log(`🔁 Updated retailer item ${existingRetail._id} with +${order.quantity} units at ₹${sellingPrice}`);
//       } else {
//         // insert new retailer inventory entry
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: distributorId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//         console.log("➕ Inserted retailer inventory with price:", sellingPrice);
//       }
//     }

//     // ---------------------------
//     // Retailer -> Customer (shipped)
//     // ---------------------------
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("🧾 Retailer → Customer: marking as shipped and reducing retailer inventory");

//       const retailerId = typeof order.sellerId === "string" ? new ObjectId(order.sellerId) : order.sellerId;
//       const productId = typeof order.productId === "string" ? new ObjectId(order.productId) : order.productId;

//       try {
//         const retailerItem = await retailerInventory.findOne({
//           productId,
//           ownerId: retailerId,
//         });
//         if (retailerItem) {
//           const newQty = Math.max(0, (retailerItem.quantity || 0) - order.quantity);
//           await retailerInventory.updateOne(
//             { _id: retailerItem._id },
//             { $set: { quantity: newQty, updatedAt: now, status: newQty <= 0 ? "out_of_stock" : retailerItem.status } }
//           );
//           console.log(`📉 Retailer stock reduced to ${newQty} for ${String(retailerItem._id)}`);
//         } else {
//           console.warn("No retailer inventory item found to deduct from for customer order.");
//         }
//       } catch (e) {
//         console.error("Failed to reduce retailer inventory:", e);
//       }
//     }

//     /**
//      * TRACEABILITY
//      */
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped from seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     try {
//       await addTraceabilityRecord({
//         productId: order.productId,
//         orderId: order._id!,
//         stage,
//         actorId: userId,
//         actorName: user.name,
//         actorRole: user.role,
//         location: {
//           name:
//             typeof order.shippingAddress === "object"
//               ? order.shippingAddress.city
//               : "Unknown",
//           address:
//             typeof order.shippingAddress === "object"
//               ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//               : "Unknown",
//         },
//         action: status,
//         description,
//         verificationStatus: "pending",
//       });
//     } catch (e) {
//       console.error("Failed to add traceability record:", e);
//     }

//     return NextResponse.json({
//       message: "Order updated successfully",
//       newStatus: status,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  *
//  * Accepts body: { status: "confirmed" | "shipped" | "delivered" | "cancelled", pricePerUnit?: number }
//  * pricePerUnit is required when seller marks order as "shipped"
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // ✅ Authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;
//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     // ✅ Database connections
//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     // ✅ Parse request body
//     const { status, pricePerUnit } = await request.json();

//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Require price when shipping
//     if (isSeller && status === "shipped" && (pricePerUnit === undefined || pricePerUnit <= 0)) {
//       return NextResponse.json(
//         { error: "Price per unit is required when shipping the order" },
//         { status: 400 }
//       );
//     }

//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };

//     if (status === "shipped" && isSeller && pricePerUnit) {
//       update.pricePerUnit = Number(pricePerUnit);
//       update.totalAmount = Number(order.quantity) * Number(pricePerUnit);
//     }

//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ If cancelled early → restore product quantity
//     if (status === "cancelled" && order.status === "pending") {
//       try {
//         await products.updateOne(
//           { _id: new ObjectId(order.productId) },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { updatedAt: now, status: "available" },
//           }
//         );
//       } catch (e) {
//         console.error("⚠️ Failed to restore product quantity:", e);
//       }
//     }

//     // ✅ Save updated order status & price
//     await orders.updateOne(
//       { _id: new ObjectId(orderId) },
//       { $set: update }
//     );

//     /**
//      * INVENTORY SYNC + PRICE PROPAGATION
//      */
//     const numericPrice =
//       typeof pricePerUnit === "number"
//         ? Number(pricePerUnit)
//         : Number(order.pricePerUnit ?? 0);

//     // 🟢 Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: new ObjectId(order.productId),
//         productName: order.productName,
//         supplierId: new ObjectId(order.sellerId),
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         pricePerUnit: numericPrice,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: new ObjectId(order.buyerId),
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // 🟡 Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       console.log("🚚 Manufacturer → Distributor shipping");

//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       // Reduce manufacturer stock
//       const manufacturerItem = await manufacturerInventory.findOne({
//         productId,
//         ownerId: new ObjectId(order.sellerId),
//       });
//       if (manufacturerItem) {
//         const newQty = Math.max(0, manufacturerItem.quantity - order.quantity);
//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : manufacturerItem.status,
//             },
//           }
//         );
//       }

//       // Insert/Update distributor inventory
//       const existing = await distributorInventory.findOne({
//         ownerId: distributorId,
//         productId,
//       });

//       if (existing) {
//         await distributorInventory.updateOne(
//           { _id: existing._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { pricePerUnit: numericPrice, status: "available", updatedAt: now },
//           }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: numericPrice,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // 🔵 Distributor → Retailer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       console.log("📦 Distributor → Retailer shipping");

//       const retailerId = new ObjectId(order.buyerId);
//       const distributorId = new ObjectId(order.sellerId);
//       const productId = new ObjectId(order.productId);

//       const distributorItem = await distributorInventory.findOne({
//         productId,
//         ownerId: distributorId,
//       });
//       if (distributorItem) {
//         const newQty = Math.max(0, distributorItem.quantity - order.quantity);
//         await distributorInventory.updateOne(
//           { _id: distributorItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : distributorItem.status,
//             },
//           }
//         );
//       }

//       const existingRetail = await retailerInventory.findOne({
//         productId,
//         ownerId: retailerId,
//       });

//       if (existingRetail) {
//         await retailerInventory.updateOne(
//           { _id: existingRetail._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { pricePerUnit: numericPrice, status: "available", updatedAt: now },
//           }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: distributorId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: numericPrice,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // 🟣 Retailer → Customer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("🧾 Retailer → Customer shipping");

//       const retailerId = new ObjectId(order.sellerId);
//       const productId = new ObjectId(order.productId);

//       const retailerItem = await retailerInventory.findOne({
//         productId,
//         ownerId: retailerId,
//       });
//       if (retailerItem) {
//         const newQty = Math.max(0, retailerItem.quantity - order.quantity);
//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : retailerItem.status,
//             },
//           }
//         );
//       }
//     }

//     // ✅ TRACEABILITY
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped by seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//       updatedPrice: pricePerUnit ?? order.pricePerUnit,
//     });
//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success) return NextResponse.json({ error: auth.error }, { status: 401 });
//     if (auth.user!.role !== "distributor") {
//       return NextResponse.json({ error: "Only distributors can update these orders" }, { status: 403 });
//     }

//     const orderId = params.id;
//     if (!ObjectId.isValid(orderId)) return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const { status, pricePerUnit } = await request.json();
//     const allowed: Order["status"][] = ["confirmed", "shipped", "delivered", "cancelled"];
//     if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const db = await getDatabase();
//     const ordersCol = db.collection<Order>("orders");
//     const retailerInventory = db.collection("retailer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");

//     const order = await ordersCol.findOne({
//       _id: new ObjectId(orderId),
//       sellerId: new ObjectId(auth.user!._id),
//       sellerRole: "distributor",
//     });
//     if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const now = new Date();
//     await ordersCol.updateOne({ _id: order._id }, { $set: { status, updatedAt: now } });

//     // ✅ Handle Distributor → Retailer Inventory on Shipping
//     if (status === "shipped") {
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       // Decrease distributor stock
//       await distributorInventory.updateOne(
//         { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//         { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//       );

//       // Add or update retailer inventory
//       const existingRetail = await retailerInventory.findOne({
//         productId: order.productId,
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingRetail) {
//         await retailerInventory.updateOne(
//           { _id: existingRetail._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { pricePerUnit: sellingPrice, status: "available", updatedAt: now },
//           }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId: order.productId,
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           location: "Retailer Warehouse",
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ✅ Traceability
//     let stage: TraceabilityRecord["stage"] = "distribution";
//     let description = "";
//     if (status === "confirmed") description = "Retailer order confirmed by distributor";
//     if (status === "shipped") description = "Retailer order shipped by distributor";
//     if (status === "delivered") { stage = "retail"; description = "Retailer order delivered"; }
//     if (status === "cancelled") description = "Retailer order cancelled";

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: new ObjectId(auth.user!._id),
//       actorName: auth.user!.name,
//       actorRole: auth.user!.role,
//       location: { name: order.shippingAddress.city, address: order.shippingAddress.street },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({ message: "Order updated successfully" });
//   } catch (e) {
//     console.error("Distributor order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// // }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = auth.user!;
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId)) {
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
//     }

//     const { status, pricePerUnit } = await request.json();
//     const allowedStatuses: Order["status"][] = [
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!allowedStatuses.includes(status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     const db = await getDatabase();
//     const ordersCol = db.collection<Order>("orders");
//     const retailerInventory = db.collection("retailer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");

//     const order = await ordersCol.findOne({
//       _id: new ObjectId(orderId),
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const now = new Date();

//     // ✅ Distributor Flow
//     if (user.role.toLowerCase() === "distributor") {
//       await ordersCol.updateOne(
//         { _id: order._id },
//         { $set: { status, updatedAt: now } }
//       );

//       // ---------------------------
//       // Distributor → Retailer (shipped)
//       // ---------------------------
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         // Decrease distributor stock
//         await distributorInventory.updateOne(
//           {
//             productId: order.productId,
//             ownerId: new ObjectId(order.sellerId),
//           },
//           {
//             $inc: { quantity: -order.quantity },
//             $set: { updatedAt: now },
//           }
//         );

//         // Add or update retailer inventory
//         const existingRetail = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingRetail) {
//           await retailerInventory.updateOne(
//             { _id: existingRetail._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await retailerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             location: "Retailer Warehouse",
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ✅ Retailer Flow
//     if (user.role.toLowerCase() === "retailer") {
//       const retailerInventory = db.collection("retailer_inventory");

//       // ---------------------------
//       // Retailer → Customer (shipped)
//       // ---------------------------
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         const retailerItem = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.sellerId),
//         });

//         if (retailerItem) {
//           const newQty = Math.max(
//             0,
//             (retailerItem.quantity || 0) - order.quantity
//           );
//           await retailerInventory.updateOne(
//             { _id: retailerItem._id },
//             {
//               $set: {
//                 quantity: newQty,
//                 updatedAt: now,
//                 status:
//                   newQty <= 0 ? "out_of_stock" : retailerItem.status,
//               },
//             }
//           );
//         }
//       }

//       // ---------------------------
//       // Retailer → Customer (delivered)
//       // ---------------------------
//       if (status === "delivered") {
//         await ordersCol.updateOne(
//           { _id: new ObjectId(orderId) },
//           {
//             $set: {
//               status: "delivered",
//               actualDeliveryDate: now,
//               updatedAt: now,
//             },
//           }
//         );

//         try {
//           await addTraceabilityRecord({
//             productId: order.productId,
//             orderId: order._id!,
//             stage: "retail",
//             actorId: new ObjectId(user._id),
//             actorName: user.name,
//             actorRole: user.role,
//             location: {
//               name:
//                 typeof order.shippingAddress === "object"
//                   ? order.shippingAddress.city
//                   : "Unknown",
//               address:
//                 typeof order.shippingAddress === "object"
//                   ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//                   : "Unknown",
//             },
//             action: "delivered",
//             description: "Retailer delivered order to customer",
//             verificationStatus: "pending",
//           });
//         } catch (e) {
//           console.error("Failed to add traceability record for delivery:", e);
//         }
//       }
//     }

//     // ✅ Common Traceability Record
//     let stage: TraceabilityRecord["stage"] = "distribution";
//     let description = "";

//     if (status === "confirmed")
//       description = "Order confirmed by seller";
//     if (status === "shipped")
//       description = "Order shipped by seller";
//     if (status === "delivered") {
//       stage = "retail";
//       description = "Order delivered successfully";
//     }
//     if (status === "cancelled") description = "Order cancelled";

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // 🔹 Verify authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = auth.user!;
//     const userRole = user.role.toLowerCase();
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId)) {
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
//     }

//     const { status, pricePerUnit } = await request.json();
//     const allowedStatuses: Order["status"][] = [
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!allowedStatuses.includes(status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     // 🔹 Get DB references
//     const db = await getDatabase();
//     const ordersCol = db.collection<Order>("orders");
//     const retailerInventory = db.collection("retailer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");

//     const order = await ordersCol.findOne({
//       _id: new ObjectId(orderId),
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const now = new Date();

//     // ✅ Distributor Flow
//     if (userRole === "distributor") {
//       await ordersCol.updateOne(
//         { _id: order._id },
//         { $set: { status, updatedAt: now } }
//       );

//       // ---------------------------
//       // Distributor → Retailer (shipped)
//       // ---------------------------
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         // Decrease distributor stock
//         await distributorInventory.updateOne(
//           {
//             productId: order.productId,
//             ownerId: new ObjectId(order.sellerId),
//           },
//           {
//             $inc: { quantity: -order.quantity },
//             $set: { updatedAt: now },
//           }
//         );

//         // Add or update retailer inventory
//         const existingRetail = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingRetail) {
//           await retailerInventory.updateOne(
//             { _id: existingRetail._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await retailerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             location: "Retailer Warehouse",
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ✅ Retailer Flow
//     if (userRole === "retailer") {
//       // ---------------------------
//       // Retailer → Customer (shipped)
//       // ---------------------------
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         const retailerItem = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.sellerId),
//         });

//         if (retailerItem) {
//           const newQty = Math.max(
//             0,
//             (retailerItem.quantity || 0) - order.quantity
//           );
//           await retailerInventory.updateOne(
//             { _id: retailerItem._id },
//             {
//               $set: {
//                 quantity: newQty,
//                 updatedAt: now,
//                 status:
//                   newQty <= 0 ? "out_of_stock" : retailerItem.status,
//               },
//             }
//           );
//         }

//         await ordersCol.updateOne(
//           { _id: new ObjectId(orderId) },
//           { $set: { status: "shipped", updatedAt: now } }
//         );
//       }

//       // ---------------------------
//       // Retailer → Customer (delivered)
//       // ---------------------------
//       if (status === "delivered") {
//         await ordersCol.updateOne(
//           { _id: new ObjectId(orderId) },
//           {
//             $set: {
//               status: "delivered",
//               actualDeliveryDate: now,
//               updatedAt: now,
//             },
//           }
//         );

//         try {
//           await addTraceabilityRecord({
//             productId: order.productId,
//             orderId: order._id!,
//             stage: "retail",
//             actorId: new ObjectId(user._id),
//             actorName: user.name,
//             actorRole: user.role,
//             location: {
//               name:
//                 typeof order.shippingAddress === "object"
//                   ? order.shippingAddress.city
//                   : "Unknown",
//               address:
//                 typeof order.shippingAddress === "object"
//                   ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//                   : "Unknown",
//             },
//             action: "delivered",
//             description: "Retailer delivered order to customer",
//             verificationStatus: "pending",
//           });
//         } catch (e) {
//           console.error("Failed to add traceability record for delivery:", e);
//         }
//       }
//     }

//     // ✅ Common Traceability Record
//     let stage: TraceabilityRecord["stage"] = "distribution";
//     let description = "";

//     if (status === "confirmed")
//       description = "Order confirmed by seller";
//     if (status === "shipped")
//       description = "Order shipped by seller";
//     if (status === "delivered") {
//       stage = "retail";
//       description = "Order delivered successfully";
//     }
//     if (status === "cancelled") description = "Order cancelled";

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * ======================================
//  * PATCH → Update Order Status (All Roles)
//  * Handles:
//  * - Farmer → Manufacturer
//  * - Manufacturer → Distributor
//  * - Distributor → Retailer
//  * - Retailer → Customer
//  * ======================================
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // 🔹 Authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const { status, pricePerUnit } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     // 🔹 Database setup
//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const farmerInventory = db.collection("farmer_inventory");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const now = new Date();

//     // =========================================
//     // 🧑‍🌾 FARMER → MANUFACTURER FLOW
//     // =========================================
//     if (role === "farmer") {
//       if (status === "shipped") {
//         // Reduce farmer inventory if exists
//         await farmerInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );
//       }
//     }

//     if (role === "manufacturer") {
//       // Manufacturer confirms order from farmer
//       if (status === "confirmed" && order.sellerRole === "farmer") {
//         await orders.updateOne(
//           { _id: order._id },
//           { $set: { status: "confirmed", updatedAt: now } }
//         );
//       }

//       // Manufacturer ships to distributor
//       if (status === "shipped" && order.sellerRole === "manufacturer") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         // Decrease manufacturer stock
//         await manufacturerInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         // Add to distributor inventory
//         const existingDist = await distributorInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingDist) {
//           await distributorInventory.updateOne(
//             { _id: existingDist._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 updatedAt: now,
//                 status: "available",
//               },
//             }
//           );
//         } else {
//           await distributorInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // =========================================
//     // 🏭 DISTRIBUTOR → RETAILER FLOW
//     // =========================================
//     if (role === "distributor") {
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         // Decrease distributor inventory
//         await distributorInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         // Add/update retailer inventory
//         const existingRetail = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingRetail) {
//           await retailerInventory.updateOne(
//             { _id: existingRetail._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await retailerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // =========================================
//     // 🏪 RETAILER → CUSTOMER FLOW
//     // =========================================
//     if (role === "retailer") {
//       if (status === "shipped") {
//         const retailerItem = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.sellerId),
//         });

//         if (retailerItem) {
//           const newQty = Math.max(
//             0,
//             (retailerItem.quantity || 0) - order.quantity
//           );

//           await retailerInventory.updateOne(
//             { _id: retailerItem._id },
//             {
//               $set: {
//                 quantity: newQty,
//                 updatedAt: now,
//                 status:
//                   newQty <= 0 ? "out_of_stock" : retailerItem.status,
//               },
//             }
//           );
//         }
//       }

//       if (status === "delivered") {
//         await orders.updateOne(
//           { _id: order._id },
//           { $set: { status: "delivered", updatedAt: now } }
//         );
//       }
//     }

//     // =========================================
//     // ✅ Common Order Update + Traceability
//     // =========================================
//     await orders.updateOne(
//       { _id: new ObjectId(orderId) },
//       { $set: { status, updatedAt: now } }
//     );

//     let stage: TraceabilityRecord["stage"] = "distribution";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped by seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered successfully";
//         break;
//       case "cancelled":
//         stage = "distribution";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order status updated successfully",
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// // }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const { status, pricePerUnit } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const farmerInventory = db.collection("farmer_inventory");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const now = new Date();

//     // ==========================================================
//     // 🧑‍🌾 FARMER → MANUFACTURER FLOW
//     // ==========================================================
//     if (role === "farmer") {
//       if (status === "shipped") {
//         // Reduce farmer stock
//         await farmerInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );
//       }

//       // ✅ When farmer marks order as "delivered" → add to manufacturer inventory
//       if (status === "delivered") {
//         const existingManufacturerItem = await manufacturerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         if (existingManufacturerItem) {
//           await manufacturerInventory.updateOne(
//             { _id: existingManufacturerItem._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 updatedAt: now,
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//               },
//             }
//           );
//         } else {
//           await manufacturerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🏭 MANUFACTURER → DISTRIBUTOR FLOW
//     // ==========================================================
//     if (role === "manufacturer") {
//       if (status === "shipped" && order.sellerRole === "manufacturer") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         await manufacturerInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         const existingDist = await distributorInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingDist) {
//           await distributorInventory.updateOne(
//             { _id: existingDist._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await distributorInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🚚 DISTRIBUTOR → RETAILER FLOW
//     // ==========================================================
//     if (role === "distributor") {
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         await distributorInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         const existingRetail = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingRetail) {
//           await retailerInventory.updateOne(
//             { _id: existingRetail._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await retailerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🛒 RETAILER → CUSTOMER FLOW
//     // ==========================================================
//     if (role === "retailer") {
//       if (status === "shipped") {
//         const retailerItem = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.sellerId),
//         });

//         if (retailerItem) {
//           const newQty = Math.max(
//             0,
//             (retailerItem.quantity || 0) - order.quantity
//           );

//           await retailerInventory.updateOne(
//             { _id: retailerItem._id },
//             {
//               $set: {
//                 quantity: newQty,
//                 updatedAt: now,
//                 status: newQty <= 0 ? "out_of_stock" : "available",
//               },
//             }
//           );
//         }
//       }
//     }

//     // ==========================================================
//     // ✅ Common Order Update & Traceability
//     // ==========================================================
//     await orders.updateOne(
//       { _id: order._id },
//       { $set: { status, updatedAt: now } }
//     );

//     let stage: TraceabilityRecord["stage"] = "distribution";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         description = "Order shipped by seller";
//         break;
//       case "delivered":
//         description = "Order delivered successfully";
//         stage = "retail";
//         break;
//       case "cancelled":
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order status updated successfully",
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const { status, pricePerUnit } = await request.json();
//     const validStatuses: Order["status"][] = [
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const farmerInventory = db.collection("farmer_inventory");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const now = new Date();

//     // ==========================================================
//     // 🧑‍🌾 FARMER → MANUFACTURER FLOW
//     // ==========================================================
//     if (role === "farmer" && order.buyerRole === "manufacturer") {
//       if (status === "shipped") {
//         // Reduce farmer stock
//         await farmerInventory.updateOne(
//           {
//             productId: order.productId,
//             ownerId: new ObjectId(order.sellerId),
//           },
//           {
//             $inc: { quantity: -order.quantity },
//             $set: { updatedAt: now },
//           }
//         );
//       }

//       if (status === "delivered") {
//         console.log("✅ Farmer delivering to Manufacturer, adding product...");
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         const existingManufacturerItem = await manufacturerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingManufacturerItem) {
//           await manufacturerInventory.updateOne(
//             { _id: existingManufacturerItem._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 updatedAt: now,
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//               },
//             }
//           );
//         } else {
//           await manufacturerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             location: "Manufacturer Warehouse",
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🏭 MANUFACTURER → DISTRIBUTOR FLOW
//     // ==========================================================
//     if (role === "manufacturer" && order.buyerRole === "distributor") {
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         // Decrease manufacturer stock
//         await manufacturerInventory.updateOne(
//           {
//             productId: order.productId,
//             ownerId: new ObjectId(order.sellerId),
//           },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         // Add to distributor inventory
//         const existingDist = await distributorInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingDist) {
//           await distributorInventory.updateOne(
//             { _id: existingDist._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await distributorInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🚚 DISTRIBUTOR → RETAILER FLOW
//     // ==========================================================
//     if (role === "distributor" && order.buyerRole === "retailer") {
//       if (status === "shipped") {
//         const sellingPrice =
//           Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         await distributorInventory.updateOne(
//           {
//             productId: order.productId,
//             ownerId: new ObjectId(order.sellerId),
//           },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         const existingRetail = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingRetail) {
//           await retailerInventory.updateOne(
//             { _id: existingRetail._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//                 updatedAt: now,
//               },
//             }
//           );
//         } else {
//           await retailerInventory.insertOne({
//             productId: order.productId,
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🛒 RETAILER → CUSTOMER FLOW
//     // ==========================================================
//     if (role === "retailer" && order.buyerRole === "customer") {
//       if (status === "shipped") {
//         const retailerItem = await retailerInventory.findOne({
//           productId: order.productId,
//           ownerId: new ObjectId(order.sellerId),
//         });

//         if (retailerItem) {
//           const newQty = Math.max(
//             0,
//             (retailerItem.quantity || 0) - order.quantity
//           );

//           await retailerInventory.updateOne(
//             { _id: retailerItem._id },
//             {
//               $set: {
//                 quantity: newQty,
//                 updatedAt: now,
//                 status: newQty <= 0 ? "out_of_stock" : "available",
//               },
//             }
//           );
//         }
//       }

//       if (status === "delivered") {
//         await orders.updateOne(
//           { _id: new ObjectId(orderId) },
//           {
//             $set: {
//               status: "delivered",
//               actualDeliveryDate: now,
//               updatedAt: now,
//             },
//           }
//         );
//       }
//     }

//     // ==========================================================
//     // ✅ Common Order Update & Traceability
//     // ==========================================================
//     await orders.updateOne(
//       { _id: order._id },
//       { $set: { status, updatedAt: now } }
//     );

//     let stage: TraceabilityRecord["stage"] = "distribution";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         description = "Order shipped by seller";
//         break;
//       case "delivered":
//         description = "Order delivered successfully";
//         stage = "retail";
//         break;
//       case "cancelled":
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order status updated successfully",
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// // }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const { status, pricePerUnit } = await request.json();
//     const validStatuses: Order["status"][] = ["confirmed", "shipped", "delivered", "cancelled"];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const farmerInventory = db.collection("farmer_inventory");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const now = new Date();
//     console.log(`🔄 ${role.toUpperCase()} updating order ${order.orderNumber} to '${status}'`);

//     // ==========================================================
//     // 🧑‍🌾 FARMER → MANUFACTURER FLOW
//     // ==========================================================
//     if (role === "farmer") {
//       if (status === "shipped") {
//         console.log("📦 Farmer shipped product:", order.productName);
//         await farmerInventory.updateOne(
//           { productId: new ObjectId(order.productId), ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );
//       }

//       if (status === "delivered") {
//         console.log("✅ Farmer delivered product:", order.productName);

//         const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         const existingManufacturerItem = await manufacturerInventory.findOne({
//           productId: new ObjectId(order.productId),
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingManufacturerItem) {
//           console.log("🔁 Updating existing manufacturer inventory...");
//           await manufacturerInventory.updateOne(
//             { _id: existingManufacturerItem._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 updatedAt: now,
//                 pricePerUnit: sellingPrice,
//                 status: "available", // ✅ make visible for distributor
//               },
//             }
//           );
//         } else {
//           console.log("➕ Inserting new manufacturer inventory...");
//           await manufacturerInventory.insertOne({
//             productId: new ObjectId(order.productId),
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             location: "Manufacturer Warehouse",
//             status: "available", // ✅ immediately available
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🏭 MANUFACTURER → DISTRIBUTOR FLOW
//     // ==========================================================
//     if (role === "manufacturer" && status === "shipped") {
//       console.log("🏭 Manufacturer shipped to distributor:", order.productName);
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       await manufacturerInventory.updateOne(
//         { productId: new ObjectId(order.productId), ownerId: new ObjectId(order.sellerId) },
//         { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//       );

//       const existingDist = await distributorInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingDist) {
//         await distributorInventory.updateOne(
//           { _id: existingDist._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: {
//               pricePerUnit: sellingPrice,
//               status: "available",
//               updatedAt: now,
//             },
//           }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ==========================================================
//     // 🚚 DISTRIBUTOR → RETAILER FLOW
//     // ==========================================================
//     if (role === "distributor" && status === "shipped") {
//       console.log("🚚 Distributor shipped to retailer:", order.productName);
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       await distributorInventory.updateOne(
//         { productId: new ObjectId(order.productId), ownerId: new ObjectId(order.sellerId) },
//         { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//       );

//       const existingRetail = await retailerInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingRetail) {
//         await retailerInventory.updateOne(
//           { _id: existingRetail._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: {
//               pricePerUnit: sellingPrice,
//               status: "available",
//               updatedAt: now,
//             },
//           }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ==========================================================
//     // 🛒 RETAILER → CUSTOMER FLOW
//     // ==========================================================
//     if (role === "retailer" && status === "shipped") {
//       console.log("🛍️ Retailer shipped to customer:", order.productName);
//       const retailerItem = await retailerInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.sellerId),
//       });

//       if (retailerItem) {
//         const newQty = Math.max(0, (retailerItem.quantity || 0) - order.quantity);
//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : "available",
//             },
//           }
//         );
//       }
//     }

//     // ==========================================================
//     // ✅ Common Order Update + Traceability
//     // ==========================================================
//     await orders.updateOne(
//       { _id: order._id },
//       { $set: { status, updatedAt: now } }
//     );

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage: role as TraceabilityRecord["stage"],
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: { name: "Warehouse", address: "Unknown" },
//       action: status,
//       description: `Order ${status} by ${user.role}`,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: `✅ Order updated to '${status}' successfully`,
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Order } from "@/lib/models/Order";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // 🔐 Authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const role = user.role.toLowerCase();
//     const orderId = params.id;

//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     const { status, pricePerUnit } = await request.json();
//     const validStatuses: Order["status"][] = ["confirmed", "shipped", "delivered", "cancelled"];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const farmerInventory = db.collection("farmer_inventory");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     const now = new Date();
//     console.log(`🔄 ${role.toUpperCase()} updating order ${order.orderNumber} to '${status}'`);

//     // ==========================================================
//     // 🧑‍🌾 FARMER → MANUFACTURER FLOW
//     // ==========================================================
//     if (role === "farmer") {
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       // 🟡 Reduce farmer stock on ship
//       if (status === "shipped") {
//         console.log("📦 Farmer shipped product:", order.productName);
//         await farmerInventory.updateOne(
//           {
//             productId: new ObjectId(order.productId),
//             ownerId: new ObjectId(order.sellerId),
//           },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );

//         // 🟢 Also immediately add to manufacturer inventory when shipped
//         console.log("🏭 Adding product to manufacturer inventory on shipment...");
//         const existingManufacturerItem = await manufacturerInventory.findOne({
//           productId: new ObjectId(order.productId),
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingManufacturerItem) {
//           await manufacturerInventory.updateOne(
//             { _id: existingManufacturerItem._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 updatedAt: now,
//                 pricePerUnit: sellingPrice,
//                 status: "available",
//               },
//             }
//           );
//         } else {
//           await manufacturerInventory.insertOne({
//             productId: new ObjectId(order.productId),
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             location: "Manufacturer Warehouse",
//             status: "available",
//             ownerId: new ObjectId(order.buyerId),
//             ownerName: order.buyerName,
//             ownerRole: "manufacturer",
//             createdAt: now,
//             updatedAt: now,
//           });
//         }
//       }
//     }

//     // ==========================================================
//     // 🏭 MANUFACTURER → DISTRIBUTOR FLOW
//     // ==========================================================
//     if (role === "manufacturer" && status === "shipped") {
//       console.log("🏭 Manufacturer shipped to distributor:", order.productName);
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       await manufacturerInventory.updateOne(
//         {
//           productId: new ObjectId(order.productId),
//           ownerId: new ObjectId(order.sellerId),
//         },
//         { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//       );

//       const existingDist = await distributorInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingDist) {
//         await distributorInventory.updateOne(
//           { _id: existingDist._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: {
//               pricePerUnit: sellingPrice,
//               status: "available",
//               updatedAt: now,
//             },
//           }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           ownerRole: "distributor",
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ==========================================================
//     // 🚚 DISTRIBUTOR → RETAILER FLOW
//     // ==========================================================
//     if (role === "distributor" && status === "shipped") {
//       console.log("🚚 Distributor shipped to retailer:", order.productName);
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       await distributorInventory.updateOne(
//         {
//           productId: new ObjectId(order.productId),
//           ownerId: new ObjectId(order.sellerId),
//         },
//         { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//       );

//       const existingRetail = await retailerInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.buyerId),
//       });

//       if (existingRetail) {
//         await retailerInventory.updateOne(
//           { _id: existingRetail._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: {
//               pricePerUnit: sellingPrice,
//               status: "available",
//               updatedAt: now,
//             },
//           }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: sellingPrice,
//           status: "available",
//           ownerId: new ObjectId(order.buyerId),
//           ownerName: order.buyerName,
//           ownerRole: "retailer",
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // ==========================================================
//     // 🛒 RETAILER → CUSTOMER FLOW
//     // ==========================================================
//     if (role === "retailer" && status === "shipped") {
//       console.log("🛍️ Retailer shipped to customer:", order.productName);
//       const retailerItem = await retailerInventory.findOne({
//         productId: new ObjectId(order.productId),
//         ownerId: new ObjectId(order.sellerId),
//       });

//       if (retailerItem) {
//         const newQty = Math.max(0, (retailerItem.quantity || 0) - order.quantity);
//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : "available",
//             },
//           }
//         );
//       }
//     }

//     // ==========================================================
//     // ✅ Common Order Update + Traceability
//     // ==========================================================
//     await orders.updateOne(
//       { _id: order._id },
//       { $set: { status, updatedAt: now } }
//     );

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage: role as TraceabilityRecord["stage"],
//       actorId: new ObjectId(user._id),
//       actorName: user.name,
//       actorRole: user.role,
//       location: { name: "Warehouse", address: "Unknown" },
//       action: status,
//       description: `Order ${status} by ${user.role}`,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: `✅ Order updated to '${status}' successfully`,
//       newStatus: status,
//     });
//   } catch (e) {
//     console.error("❌ Order update error:", e);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";
// import type { Product } from "@/lib/models/Product";
// import { addBlock } from "@/lib/blockchain";
// import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * PATCH → Update order status (seller or buyer)
//  *
//  * Accepts body: { status: "confirmed" | "shipped" | "delivered" | "cancelled", pricePerUnit?: number }
//  * pricePerUnit is required when seller marks order as "shipped"
//  */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // ✅ Authentication
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const orderId = params.id;
//     if (!ObjectId.isValid(orderId))
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

//     // ✅ Database connections
//     const db = await getDatabase();
//     const orders = db.collection<Order>("orders");
//     const products = db.collection<Product>("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");

//     const order = await orders.findOne({ _id: new ObjectId(orderId) });
//     if (!order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     // ✅ Parse request body
//     const { status, pricePerUnit } = await request.json();

//     const validStatuses: Order["status"][] = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status))
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });

//     const userId = new ObjectId(user._id);
//     const isSeller = String(order.sellerId) === String(userId);
//     const isBuyer = String(order.buyerId) === String(userId);

//     if (!isSeller && !isBuyer)
//       return NextResponse.json(
//         { error: "Not authorized to update this order" },
//         { status: 403 }
//       );

//     // ✅ Require price when shipping
//     // ✅ Handle missing price more gracefully
// if (isSeller && status === "shipped") {
//   // If both the new price and existing order price are missing, then error
//   if (
//     (pricePerUnit === undefined || pricePerUnit <= 0) &&
//     (!order.pricePerUnit || order.pricePerUnit <= 0)
//   ) {
//     return NextResponse.json(
//       { error: "Price per unit missing — please provide or ensure order has one." },
//       { status: 400 }
//     );
//   }
// }


//     const now = new Date();
//     const update: Partial<Order> = { status, updatedAt: now };

//     if (status === "shipped" && isSeller && pricePerUnit) {
//       update.pricePerUnit = Number(pricePerUnit);
//       update.totalAmount = Number(order.quantity) * Number(pricePerUnit);
//     }

//     if (status === "delivered") update.actualDeliveryDate = now;

//     // ✅ If cancelled early → restore product quantity
//     if (status === "cancelled" && order.status === "pending") {
//       try {
//         await products.updateOne(
//           { _id: new ObjectId(order.productId) },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { updatedAt: now, status: "available" },
//           }
//         );
//       } catch (e) {
//         console.error("⚠️ Failed to restore product quantity:", e);
//       }
//     }

//     // ✅ Save updated order status & price
//     await orders.updateOne(
//       { _id: new ObjectId(orderId) },
//       { $set: update }
//     );

//     /**
//      * INVENTORY SYNC + PRICE PROPAGATION
//      */
//     const numericPrice =
//       typeof pricePerUnit === "number"
//         ? Number(pricePerUnit)
//         : Number(order.pricePerUnit ?? 0);

//     // 🟢 Farmer → Manufacturer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "farmer" &&
//       order.buyerRole === "manufacturer"
//     ) {
//       await manufacturerInventory.insertOne({
//         productId: new ObjectId(order.productId),
//         productName: order.productName,
//         supplierId: new ObjectId(order.sellerId),
//         supplierName: order.sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: order.quantity,
//         unit: order.unit,
//         pricePerUnit: numericPrice,
//         location:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         status: "available",
//         ownerId: new ObjectId(order.buyerId),
//         ownerName: order.buyerName,
//         createdAt: now,
//         updatedAt: now,
//       });
//     }

//     // 🟡 Manufacturer → Distributor
//     if (
//       status === "shipped" &&
//       order.sellerRole === "manufacturer" &&
//       order.buyerRole === "distributor"
//     ) {
//       console.log("🚚 Manufacturer → Distributor shipping");

//       const distributorId = new ObjectId(order.buyerId);
//       const productId = new ObjectId(order.productId);

//       // Reduce manufacturer stock
//       const manufacturerItem = await manufacturerInventory.findOne({
//         productId,
//         ownerId: new ObjectId(order.sellerId),
//       });
//       if (manufacturerItem) {
//         const newQty = Math.max(0, manufacturerItem.quantity - order.quantity);
//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : manufacturerItem.status,
//             },
//           }
//         );
//       }

//       // Insert/Update distributor inventory
//       const existing = await distributorInventory.findOne({
//         ownerId: distributorId,
//         productId,
//       });

//       if (existing) {
//         await distributorInventory.updateOne(
//           { _id: existing._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { pricePerUnit: numericPrice, status: "available", updatedAt: now },
//           }
//         );
//       } else {
//         await distributorInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: new ObjectId(order.sellerId),
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: numericPrice,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: distributorId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // 🔵 Distributor → Retailer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "distributor" &&
//       order.buyerRole === "retailer"
//     ) {
//       console.log("📦 Distributor → Retailer shipping");

//       const retailerId = new ObjectId(order.buyerId);
//       const distributorId = new ObjectId(order.sellerId);
//       const productId = new ObjectId(order.productId);

//       const distributorItem = await distributorInventory.findOne({
//         productId,
//         ownerId: distributorId,
//       });
//       if (distributorItem) {
//         const newQty = Math.max(0, distributorItem.quantity - order.quantity);
//         await distributorInventory.updateOne(
//           { _id: distributorItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : distributorItem.status,
//             },
//           }
//         );
//       }

//       const existingRetail = await retailerInventory.findOne({
//         productId,
//         ownerId: retailerId,
//       });

//       if (existingRetail) {
//         await retailerInventory.updateOne(
//           { _id: existingRetail._id },
//           {
//             $inc: { quantity: order.quantity },
//             $set: { pricePerUnit: numericPrice, status: "available", updatedAt: now },
//           }
//         );
//       } else {
//         await retailerInventory.insertOne({
//           productId,
//           productName: order.productName,
//           supplierId: distributorId,
//           supplierName: order.sellerName,
//           batchNumber: `BATCH-${Date.now()}`,
//           quantity: order.quantity,
//           unit: order.unit,
//           pricePerUnit: numericPrice,
//           location: "Retailer warehouse",
//           status: "available",
//           ownerId: retailerId,
//           ownerName: order.buyerName,
//           createdAt: now,
//           updatedAt: now,
//         });
//       }
//     }

//     // 🟣 Retailer → Customer
//     if (
//       status === "shipped" &&
//       order.sellerRole === "retailer" &&
//       order.buyerRole === "customer"
//     ) {
//       console.log("🧾 Retailer → Customer shipping");

//       const retailerId = new ObjectId(order.sellerId);
//       const productId = new ObjectId(order.productId);

//       const retailerItem = await retailerInventory.findOne({
//         productId,
//         ownerId: retailerId,
//       });
//       if (retailerItem) {
//         const newQty = Math.max(0, retailerItem.quantity - order.quantity);
//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: newQty,
//               updatedAt: now,
//               status: newQty <= 0 ? "out_of_stock" : retailerItem.status,
//             },
//           }
//         );
//       }
//     }

//     // ✅ TRACEABILITY
//     let stage: TraceabilityRecord["stage"] = "farm";
//     let description = "";

//     switch (status) {
//       case "confirmed":
//         stage = "processing";
//         description = "Order confirmed by seller";
//         break;
//       case "shipped":
//         stage = "distribution";
//         description = "Order shipped by seller";
//         break;
//       case "delivered":
//         stage = "retail";
//         description = "Order delivered to buyer";
//         break;
//       case "cancelled":
//         stage = "farm";
//         description = "Order cancelled";
//         break;
//     }

//     await addTraceabilityRecord({
//       productId: order.productId,
//       orderId: order._id!,
//       stage,
//       actorId: userId,
//       actorName: user.name,
//       actorRole: user.role,
//       location: {
//         name:
//           typeof order.shippingAddress === "object"
//             ? order.shippingAddress.city
//             : "Unknown",
//         address:
//           typeof order.shippingAddress === "object"
//             ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
//             : "Unknown",
//       },
//       action: status,
//       description,
//       verificationStatus: "pending",
//     });

//     return NextResponse.json({
//       message: "✅ Order updated successfully",
//       newStatus: status,
//       updatedPrice: pricePerUnit ?? order.pricePerUnit,
//     });
//     await addBlock({
//   productId: order.productId,
//   orderId: order._id!,
//   actorId: new ObjectId(user._id),
//   actorRole: user.role,
//   action: status,
//   data: {
//     seller: order.sellerName,
//     buyer: order.buyerName,
//     quantity: order.quantity,
//     pricePerUnit: order.pricePerUnit,
//     totalAmount: order.totalAmount,
//   },
// });

//   } catch (error) {
//     console.error("❌ PATCH /api/orders/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth } from "@/lib/auth";
import type { Order } from "@/lib/models/Order";
import type { Product } from "@/lib/models/Product";
import { addBlock } from "@/lib/blockchain";
import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";
import { addTraceabilityRecord } from "@/lib/services/traceability-service";

/**
 * PATCH → Update order status (seller or buyer)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Authentication
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    const orderId = params.id;
    if (!ObjectId.isValid(orderId))
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

    // ✅ Database connections
    const db = await getDatabase();
    const orders = db.collection<Order>("orders");
    const products = db.collection<Product>("products");
    const manufacturerInventory = db.collection("manufacturer_inventory");
    const distributorInventory = db.collection("distributor_inventory");
    const retailerInventory = db.collection("retailer_inventory");

    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // ✅ Parse request body
    const { status, pricePerUnit } = await request.json();

    const validStatuses: Order["status"][] = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const userId = new ObjectId(user._id);
    const isSeller = String(order.sellerId) === String(userId);
    const isBuyer = String(order.buyerId) === String(userId);

    if (!isSeller && !isBuyer)
      return NextResponse.json(
        { error: "Not authorized to update this order" },
        { status: 403 }
      );

    // ✅ Require price when shipping (more graceful)
    if (isSeller && status === "shipped") {
      if (
        (pricePerUnit === undefined || pricePerUnit <= 0) &&
        (!order.pricePerUnit || order.pricePerUnit <= 0)
      ) {
        return NextResponse.json(
          {
            error:
              "Price per unit missing — please provide or ensure order has one.",
          },
          { status: 400 }
        );
      }
    }

    const now = new Date();
    const update: Partial<Order> = { status, updatedAt: now };

    if (status === "shipped" && isSeller && pricePerUnit) {
      update.pricePerUnit = Number(pricePerUnit);
      update.totalAmount = Number(order.quantity) * Number(pricePerUnit);
    }

    if (status === "delivered") update.actualDeliveryDate = now;

    // ✅ If cancelled early → restore product quantity
    if (status === "cancelled" && order.status === "pending") {
      try {
        await products.updateOne(
          { _id: new ObjectId(order.productId) },
          {
            $inc: { quantity: order.quantity },
            $set: { updatedAt: now, status: "available" },
          }
        );
      } catch (e) {
        console.error("⚠️ Failed to restore product quantity:", e);
      }
    }

    // ✅ Save updated order status & price
    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: update }
    );

    /**
     * INVENTORY SYNC + PRICE PROPAGATION
     */
    const numericPrice =
      typeof pricePerUnit === "number"
        ? Number(pricePerUnit)
        : Number(order.pricePerUnit ?? 0);

    // 🟢 Farmer → Manufacturer
    if (
      status === "shipped" &&
      order.sellerRole === "farmer" &&
      order.buyerRole === "manufacturer"
    ) {
      await manufacturerInventory.insertOne({
        productId: new ObjectId(order.productId),
        productName: order.productName,
        supplierId: new ObjectId(order.sellerId),
        supplierName: order.sellerName,
        batchNumber: `BATCH-${Date.now()}`,
        quantity: order.quantity,
        unit: order.unit,
        pricePerUnit: numericPrice,
        location:
          typeof order.shippingAddress === "object"
            ? order.shippingAddress.city
            : "Unknown",
        status: "available",
        ownerId: new ObjectId(order.buyerId),
        ownerName: order.buyerName,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 🏭 Manufacturer → Distributor
    if (
      status === "shipped" &&
      order.sellerRole === "manufacturer" &&
      order.buyerRole === "distributor"
    ) {
      console.log("🚚 Manufacturer → Distributor shipping");

      const distributorId = new ObjectId(order.buyerId);
      const productId = new ObjectId(order.productId);

      // Reduce manufacturer stock
      const manufacturerItem = await manufacturerInventory.findOne({
        productId,
        ownerId: new ObjectId(order.sellerId),
      });
      if (manufacturerItem) {
        const newQty = Math.max(0, manufacturerItem.quantity - order.quantity);
        await manufacturerInventory.updateOne(
          { _id: manufacturerItem._id },
          {
            $set: {
              quantity: newQty,
              updatedAt: now,
              status: newQty <= 0 ? "out_of_stock" : manufacturerItem.status,
            },
          }
        );
      }

      // Insert/Update distributor inventory
      const existing = await distributorInventory.findOne({
        ownerId: distributorId,
        productId,
      });

      if (existing) {
        await distributorInventory.updateOne(
          { _id: existing._id },
          {
            $inc: { quantity: order.quantity },
            $set: {
              pricePerUnit: numericPrice,
              status: "available",
              updatedAt: now,
            },
          }
        );
      } else {
        await distributorInventory.insertOne({
          productId,
          productName: order.productName,
          supplierId: new ObjectId(order.sellerId),
          supplierName: order.sellerName,
          batchNumber: `BATCH-${Date.now()}`,
          quantity: order.quantity,
          unit: order.unit,
          pricePerUnit: numericPrice,
          location: "Distributor warehouse",
          status: "available",
          ownerId: distributorId,
          ownerName: order.buyerName,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // 🔵 Distributor → Retailer
    if (
      status === "shipped" &&
      order.sellerRole === "distributor" &&
      order.buyerRole === "retailer"
    ) {
      console.log("📦 Distributor → Retailer shipping");

      const retailerId = new ObjectId(order.buyerId);
      const distributorId = new ObjectId(order.sellerId);
      const productId = new ObjectId(order.productId);

      const distributorItem = await distributorInventory.findOne({
        productId,
        ownerId: distributorId,
      });
      if (distributorItem) {
        const newQty = Math.max(0, distributorItem.quantity - order.quantity);
        await distributorInventory.updateOne(
          { _id: distributorItem._id },
          {
            $set: {
              quantity: newQty,
              updatedAt: now,
              status: newQty <= 0 ? "out_of_stock" : distributorItem.status,
            },
          }
        );
      }

      const existingRetail = await retailerInventory.findOne({
        productId,
        ownerId: retailerId,
      });

      if (existingRetail) {
        await retailerInventory.updateOne(
          { _id: existingRetail._id },
          {
            $inc: { quantity: order.quantity },
            $set: {
              pricePerUnit: numericPrice,
              status: "available",
              updatedAt: now,
            },
          }
        );
      } else {
        await retailerInventory.insertOne({
          productId,
          productName: order.productName,
          supplierId: distributorId,
          supplierName: order.sellerName,
          batchNumber: `BATCH-${Date.now()}`,
          quantity: order.quantity,
          unit: order.unit,
          pricePerUnit: numericPrice,
          location: "Retailer warehouse",
          status: "available",
          ownerId: retailerId,
          ownerName: order.buyerName,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // 🟣 Retailer → Customer
    if (
      status === "shipped" &&
      order.sellerRole === "retailer" &&
      order.buyerRole === "customer"
    ) {
      console.log("🧾 Retailer → Customer shipping");

      const retailerId = new ObjectId(order.sellerId);
      const productId = new ObjectId(order.productId);

      const retailerItem = await retailerInventory.findOne({
        productId,
        ownerId: retailerId,
      });
      if (retailerItem) {
        const newQty = Math.max(0, retailerItem.quantity - order.quantity);
        await retailerInventory.updateOne(
          { _id: retailerItem._id },
          {
            $set: {
              quantity: newQty,
              updatedAt: now,
              status: newQty <= 0 ? "out_of_stock" : retailerItem.status,
            },
          }
        );
      }
    }

    // ✅ TRACEABILITY
    let stage: TraceabilityRecord["stage"] = "farm";
    let description = "";

    switch (status) {
      case "confirmed":
        stage = "processing";
        description = "Order confirmed by seller";
        break;
      case "shipped":
        stage = "distribution";
        description = "Order shipped by seller";
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

    // Add traceability record
    await addTraceabilityRecord({
      productId: order.productId,
      orderId: order._id!,
      stage,
      actorId: userId,
      actorName: user.name,
      actorRole: user.role,
      location: {
        name:
          typeof order.shippingAddress === "object"
            ? order.shippingAddress.city
            : "Unknown",
        address:
          typeof order.shippingAddress === "object"
            ? `${order.shippingAddress.street}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
            : "Unknown",
      },
      action: status,
      description,
      verificationStatus: "pending",
    });

    // ✅ Add Blockchain Record (moved BEFORE return)
    await addBlock({
      productId: order.productId,
      orderId: order._id!,
      actorId: new ObjectId(user._id),
      actorRole: user.role,
      action: status,
      data: {
        seller: order.sellerName,
        buyer: order.buyerName,
        quantity: order.quantity,
        pricePerUnit: order.pricePerUnit,
        totalAmount: order.totalAmount,
      },
    });

    // ✅ Return response last
    return NextResponse.json({
      message: "✅ Order updated successfully",
      newStatus: status,
      updatedPrice: pricePerUnit ?? order.pricePerUnit,
    });
  } catch (error) {
    console.error("❌ PATCH /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


