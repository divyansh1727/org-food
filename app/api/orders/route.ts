// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id);

//     let filter: Record<string, any> = {};

//     switch (role) {
//       case "farmer":
//         filter = { sellerId: userId, sellerRole: "farmer" };
//         break;
//       case "manufacturer":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "manufacturer" },
//             { sellerId: userId, sellerRole: "manufacturer" },
//           ],
//         };
//         break;
//       case "distributor":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "distributor" },
//             { sellerId: userId, sellerRole: "distributor" },
//           ],
//         };
//         break;
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders });
//   } catch (error) {
//     console.error("GET /api/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const { productId, quantity, shippingAddress } = await request.json();

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const db = await getDatabase();
//     const products = db.collection("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const orders = db.collection<Order>("orders");

//     const userRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);
//     const buyerName = user.name;
//     const buyerRole = userRole as Order["buyerRole"];

//     // ✅ STEP 1: Fetch product based on buyer role
//     let product: any = null;

//     if (userRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $and: [
//           {
//             $or: [
//               { _id: new ObjectId(productId) },
//               { productId: new ObjectId(productId) },
//             ],
//           },
//           { ownerId: { $ne: new ObjectId(user._id) } },
//         ],
//       });
//     } else if (userRole === "manufacturer") {
//       product =
//         (await products.findOne({ _id: new ObjectId(productId) })) ||
//         (await manufacturerInventory.findOne({ _id: new ObjectId(productId) }));
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ STEP 2: Ensure product ownership
//     if (!product.ownerId || !product.ownerName) {
//       const fixedOwnerId =
//         product.farmerId || product.supplierId
//           ? new ObjectId(product.farmerId || product.supplierId)
//           : new ObjectId(user._id);
//       const fixedOwnerName =
//         product.farmerName || product.supplierName || user.name;

//       const targetCollection = product.farmerId
//         ? products
//         : manufacturerInventory;

//       await targetCollection.updateOne(
//         { _id: new ObjectId(productId) },
//         {
//           $set: {
//             ownerId: fixedOwnerId,
//             ownerName: fixedOwnerName,
//             ownerRole:
//               userRole === "manufacturer"
//                 ? "farmer"
//                 : userRole === "distributor"
//                 ? "manufacturer"
//                 : "unknown",
//           },
//         }
//       );

//       product.ownerId = fixedOwnerId;
//       product.ownerName = fixedOwnerName;
//     }

//     // ✅ STEP 3: Determine seller
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];

//     if (buyerRole === "manufacturer") {
//       // manufacturer buying from farmer
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";

//       await manufacturerInventory.insertOne({
//         productId: new ObjectId(product._id || product.productId),
//         productName: product.productName || product.name || "Unnamed Product",
//         supplierId: sellerId,
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         location: "Manufacturer warehouse",
//         status: "available",
//         ownerId: buyerId,
//         ownerName: buyerName,
//         ownerRole: "manufacturer",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     } else if (buyerRole === "distributor") {
//       // distributor buying from manufacturer
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (!manufacturerItem)
//         return NextResponse.json(
//           { error: "Manufacturer product not found" },
//           { status: 404 }
//         );

//       if (!manufacturerItem.ownerId || !manufacturerItem.ownerName)
//         return NextResponse.json(
//           { error: "Invalid manufacturer item ownership" },
//           { status: 400 }
//         );

//       sellerId = new ObjectId(manufacturerItem.ownerId);
//       sellerName = manufacturerItem.ownerName;
//       sellerRole = "manufacturer";
//     } else {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName || "Unknown";
//       sellerRole = "farmer";
//     }

//     // ✅ Prevent self-order
//     if (String(sellerId) === String(buyerId))
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       );

//     // ✅ STEP 4: Create order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(productId),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ STEP 5: Distributor purchase updates manufacturer stock
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         );

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: { quantity: remainingQty, updatedAt: new Date() },
//             $push: {
//               salesHistory: {
//                 orderId: result.insertedId,
//                 buyerId,
//                 buyerName,
//                 quantity,
//                 date: new Date(),
//               },
//             } as any,
//           }
//         );

//         // ✅ Add product to distributor inventory
//         await distributorInventory.insertOne({
//           productId: manufacturerItem.productId,
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "available",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           ownerRole: "distributor",
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "Order created successfully", order },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/orders error:", error);
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

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id);

//     let filter: Record<string, any> = {};

//     switch (role) {
//       case "farmer":
//         filter = { sellerId: userId, sellerRole: "farmer" };
//         break;
//       case "manufacturer":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "manufacturer" },
//             { sellerId: userId, sellerRole: "manufacturer" },
//           ],
//         };
//         break;
//       case "distributor":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "distributor" },
//             { sellerId: userId, sellerRole: "distributor" },
//           ],
//         };
//         break;
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders });
//   } catch (error) {
//     console.error("GET /api/orders error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const { productId, quantity, shippingAddress } = await request.json();

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const db = await getDatabase();
//     const products = db.collection("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const orders = db.collection<Order>("orders");

//     const userRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);
//     const buyerName = user.name;
//     const buyerRole = userRole as Order["buyerRole"];

//     // ✅ STEP 1: Fetch product based on buyer role
//     let product: any = null;

//     if (userRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $and: [
//           {
//             $or: [
//               { _id: new ObjectId(productId) },
//               { productId: new ObjectId(productId) },
//             ],
//           },
//           { ownerId: { $ne: new ObjectId(user._id) } },
//         ],
//       });
//     } else if (userRole === "manufacturer") {
//       product =
//         (await products.findOne({ _id: new ObjectId(productId) })) ||
//         (await manufacturerInventory.findOne({ _id: new ObjectId(productId) }));
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ STEP 2: Ensure product ownership
//     if (!product.ownerId || !product.ownerName) {
//       const fixedOwnerId =
//         product.farmerId || product.supplierId
//           ? new ObjectId(product.farmerId || product.supplierId)
//           : new ObjectId(user._id);
//       const fixedOwnerName =
//         product.farmerName || product.supplierName || user.name;

//       const targetCollection = product.farmerId
//         ? products
//         : manufacturerInventory;

//       await targetCollection.updateOne(
//         { _id: new ObjectId(productId) },
//         {
//           $set: {
//             ownerId: fixedOwnerId,
//             ownerName: fixedOwnerName,
//           },
//         }
//       );

//       product.ownerId = fixedOwnerId;
//       product.ownerName = fixedOwnerName;
//     }

//     // ✅ STEP 3: Determine seller
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];

//     if (buyerRole === "manufacturer") {
//       // manufacturer buying from farmer
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";

//       await manufacturerInventory.insertOne({
//         productId: new ObjectId(product._id || product.productId),
//         productName: product.productName || product.name || "Unnamed Product",
//         supplierId: sellerId,
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         location: "Manufacturer warehouse",
//         status: "available",
//         ownerId: buyerId,
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     } else if (buyerRole === "distributor") {
//       // distributor buying from manufacturer
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (!manufacturerItem)
//         return NextResponse.json(
//           { error: "Manufacturer product not found" },
//           { status: 404 }
//         );

//       sellerId = new ObjectId(manufacturerItem.ownerId);
//       sellerName = manufacturerItem.ownerName;
//       sellerRole = "manufacturer";
//     } else {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName || "Unknown";
//       sellerRole = "farmer";
//     }

//     // ✅ Prevent self-order
//     if (String(sellerId) === String(buyerId))
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       );

//     // ✅ STEP 4: Create order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(productId),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ STEP 5: Distributor purchase updates manufacturer stock
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         );

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: { quantity: remainingQty, updatedAt: new Date() },
//           }
//         );

//         // ✅ Add product to distributor inventory (PENDING until shipped)
//         await distributorInventory.insertOne({
//           productId: manufacturerItem.productId,
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending", // 🔹 Now pending until manufacturer ships
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "Order created successfully", order },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/orders error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id);

//     let filter: Record<string, any> = {};

//     switch (role) {
//       case "farmer":
//         filter = { sellerId: userId, sellerRole: "farmer" };
//         break;
//       case "manufacturer":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "manufacturer" },
//             { sellerId: userId, sellerRole: "manufacturer" },
//           ],
//         };
//         break;
//       case "distributor":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "distributor" },
//             { sellerId: userId, sellerRole: "distributor" },
//           ],
//         };
//         break;
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders });
//   } catch (error) {
//     console.error("GET /api/orders error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const { productId, quantity, shippingAddress } = await request.json();

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const db = await getDatabase();
//     const products = db.collection("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const orders = db.collection<Order>("orders");

//     const userRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);
//     const buyerName = user.name;
//     const buyerRole = userRole as Order["buyerRole"];

//     let product: any = null;

//     // ✅ Step 1: Get the correct product reference
//     if (userRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else if (userRole === "manufacturer") {
//       product =
//         (await products.findOne({ _id: new ObjectId(productId) })) ||
//         (await manufacturerInventory.findOne({
//           $or: [
//             { _id: new ObjectId(productId) },
//             { productId: new ObjectId(productId) },
//           ],
//         }));
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Step 2: Ensure consistent owner info
//     if (!product.ownerId || !product.ownerName) {
//       const fixedOwnerId =
//         product.farmerId || product.supplierId
//           ? new ObjectId(product.farmerId || product.supplierId)
//           : new ObjectId(user._id);
//       const fixedOwnerName =
//         product.farmerName || product.supplierName || user.name;

//       await products.updateOne(
//         { _id: new ObjectId(productId) },
//         {
//           $set: {
//             ownerId: fixedOwnerId,
//             ownerName: fixedOwnerName,
//           },
//         }
//       );

//       product.ownerId = fixedOwnerId;
//       product.ownerName = fixedOwnerName;
//     }

//     // ✅ Step 3: Determine seller
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];

//     if (buyerRole === "manufacturer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";
//     } else if (buyerRole === "distributor") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "manufacturer";
//     } else {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";
//     }

//     // ✅ Prevent self-order
//     if (String(sellerId) === String(buyerId))
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       );

//     // ✅ Step 4: Create Order with consistent productId
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(product.productId || product._id), // ✅ FIX: Always use consistent productId
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ Step 5: Distributor purchase from manufacturer → Add pending inventory
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         );

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           { $set: { quantity: remainingQty, updatedAt: new Date() } }
//         );

//         // ✅ FIX: Use the same productId as in the order (not manufacturer’s own _id)
//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId), // ✅ consistent product link
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending", // stays pending until shipped
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "Order created successfully", order },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/orders error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";
// import type { Order } from "@/lib/models/Order";

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id);

//     let filter: Record<string, any> = {};

//     switch (role) {
//       case "farmer":
//         filter = { sellerId: userId, sellerRole: "farmer" };
//         break;
//       case "manufacturer":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "manufacturer" },
//             { sellerId: userId, sellerRole: "manufacturer" },
//           ],
//         };
//         break;
//       case "distributor":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "distributor" },
//             { sellerId: userId, sellerRole: "distributor" },
//           ],
//         };
//         break;
//       case "retailer":
//         filter = {
//           $or: [
//             { buyerId: userId, buyerRole: "retailer" },
//             { sellerId: userId, sellerRole: "retailer" },
//           ],
//         };
//         break;
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders });
//   } catch (error) {
//     console.error("GET /api/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const { productId, quantity, shippingAddress } = await request.json();

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const db = await getDatabase();
//     const products = db.collection("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     const userRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);
//     const buyerName = user.name;
//     const buyerRole = userRole as Order["buyerRole"];

//     let product: any = null;

//     // ✅ Step 1: Fetch correct product source
//     if (buyerRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else if (buyerRole === "retailer") {
//       product = await distributorInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Step 2: Determine Seller
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];

//     if (buyerRole === "manufacturer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";
//     } else if (buyerRole === "distributor") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "manufacturer";
//     } else if (buyerRole === "retailer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "distributor";
//     } else {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName || "Unknown";
//       sellerRole = "farmer";
//     }

//     if (String(sellerId) === String(buyerId)) {
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       );
//     }

//     // ✅ Step 3: Create Order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ Step 4: Handle Inventory Impact
//     if (buyerRole === "retailer" && sellerRole === "distributor") {
//       await retailerInventory.insertOne({
//         productId: new ObjectId(order.productId),
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Retailer warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         );

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           { $set: { quantity: remainingQty, updatedAt: new Date() } }
//         );

//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "Order created successfully", order },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/orders error:", error);
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

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id); // ✅ ensure it's always ObjectId

//     let filter: Record<string, any> = {};

//     switch (role) {
//       case "farmer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "farmer" },
//             { buyerId: userId, buyerRole: "farmer" },
//           ],
//         };
//         break;
//       case "manufacturer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "manufacturer" },
//             { buyerId: userId, buyerRole: "manufacturer" },
//           ],
//         };
//         break;
//       case "distributor":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "distributor" },
//             { buyerId: userId, buyerRole: "distributor" },
//           ],
//         };
//         break;
//       case "retailer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "retailer" },
//             { buyerId: userId, buyerRole: "retailer" },
//           ],
//         };
//         break;
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     console.log("🔍 Order filter used:", JSON.stringify(filter));

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders });
//   } catch (error) {
//     console.error("GET /api/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const { productId, quantity, shippingAddress } = await request.json();

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const db = await getDatabase();
//     const products = db.collection("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     const userRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);
//     const buyerName = user.name;
//     const buyerRole = userRole as Order["buyerRole"];

//     let product: any = null;

//     // ✅ Fetch correct product source
//     if (buyerRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else if (buyerRole === "retailer") {
//       product = await distributorInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Determine Seller
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];

//     if (buyerRole === "manufacturer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";
//     } else if (buyerRole === "distributor") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "manufacturer";
//     } else if (buyerRole === "retailer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "distributor";
//     } else {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName || "Unknown";
//       sellerRole = "farmer";
//     }

//     if (String(sellerId) === String(buyerId)) {
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       );
//     }

//     // ✅ Create Order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ Inventory Impact for Retailer Orders
//     if (buyerRole === "retailer" && sellerRole === "distributor") {
//       await retailerInventory.insertOne({
//         productId: new ObjectId(order.productId),
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Retailer warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     // ✅ Inventory impact for Distributor Orders
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         );

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           { $set: { quantity: remainingQty, updatedAt: new Date() } }
//         );

//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "Order created successfully", order },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/orders error:", error);
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

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id);

//     let filter: Record<string, any> = {};

//     switch (role) {
//       case "farmer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "farmer" },
//             { buyerId: userId, buyerRole: "farmer" },
//           ],
//         };
//         break;
//       case "manufacturer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "manufacturer" },
//             { buyerId: userId, buyerRole: "manufacturer" },
//           ],
//         };
//         break;
//       case "distributor":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "distributor" },
//             { buyerId: userId, buyerRole: "distributor" },
//           ],
//         };
//         break;
//       case "retailer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: "retailer" },
//             { buyerId: userId, buyerRole: "retailer" },
//           ],
//         };
//         break;
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders });
//   } catch (error) {
//     console.error("GET /api/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const { productId, quantity, shippingAddress } = await request.json();

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const db = await getDatabase();
//     const products = db.collection("products");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     const userRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);
//     const buyerName = user.name;
//     const buyerRole = userRole as Order["buyerRole"];

//     let product: any = null;

//     // ✅ Fetch correct product source
//     if (buyerRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else if (buyerRole === "retailer") {
//       product = await distributorInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Determine Seller
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];

//     if (buyerRole === "manufacturer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";
//     } else if (buyerRole === "distributor") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "manufacturer";
//     } else if (buyerRole === "retailer") {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "distributor";
//     } else {
//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName || "Unknown";
//       sellerRole = "farmer";
//     }

//     // ✅ Prevent self-order
//     if (String(sellerId) === String(buyerId)) {
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       );
//     }

//     // ✅ Create Order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     await orders.insertOne(order);

//     /* ======================================
//        Retailer Orders → Impact Distributor Inventory
//     ====================================== */
//     if (buyerRole === "retailer" && sellerRole === "distributor") {
//       // 🔹 Step 1: Decrease distributor stock
//       const remainingQty = Math.max(0, (product.quantity || 0) - quantity);

//       await distributorInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : product.status,
//           },
//         }
//       );

//       // 🔹 Step 2: Add to retailer's pending inventory
//       await retailerInventory.insertOne({
//         productId: new ObjectId(order.productId),
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Retailer warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     /* ======================================
//        Distributor Orders → Impact Manufacturer Inventory
//     ====================================== */
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       });

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         );

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status:
//                 remainingQty <= 0 ? "out_of_stock" : manufacturerItem.status,
//             },
//           }
//         );

//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "✅ Order created successfully", order },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




// import { NextRequest, NextResponse } from "next/server"
// import { getDatabase } from "@/lib/mongodb"
// import { ObjectId } from "mongodb"
// import { verifyAuth } from "@/lib/auth"
// import type { Order } from "@/lib/models/Order"

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 })

//     const user = auth.user!
//     const db = await getDatabase()
//     const ordersCollection = db.collection<Order>("orders")

//     const role = user.role.toLowerCase()
//     const userId = new ObjectId(user._id)

//     let filter: Record<string, any> = {}

//     switch (role) {
//       case "farmer":
//       case "manufacturer":
//       case "distributor":
//       case "retailer":
//       case "customer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: role },
//             { buyerId: userId, buyerRole: role },
//           ],
//         }
//         break
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray()

//     return NextResponse.json({ orders })
//   } catch (error) {
//     console.error("GET /api/orders error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// /* ======================================
//    POST → Create new order
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const user = auth.user!
//     const { productId, quantity, shippingAddress } = await request.json()

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 })

//     const db = await getDatabase()
//     const products = db.collection("products")
//     const manufacturerInventory = db.collection("manufacturer_inventory")
//     const distributorInventory = db.collection("distributor_inventory")
//     const retailerInventory = db.collection("retailer_inventory")
//     const orders = db.collection<Order>("orders")

//     const buyerRole = user.role.toLowerCase() as Order["buyerRole"]
//     const buyerId = new ObjectId(user._id)
//     const buyerName = user.name

//     let product: any = null
//     let sellerId: ObjectId
//     let sellerName = ""
//     let sellerRole: Order["sellerRole"]

//     // ✅ Fetch correct product source and seller based on buyer role
//     if (buyerRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })
//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "manufacturer" as Order["sellerRole"]
//     } else if (buyerRole === "retailer") {
//       product = await distributorInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })
//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "distributor" as Order["sellerRole"]
//     } else if (buyerRole === "customer") {
//       product = await retailerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "retailer" as Order["sellerRole"]
//     } else {
//       product = await products.findOne({ _id: new ObjectId(productId) })
//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "farmer" as Order["sellerRole"]
//     }

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 })

//     if (String(sellerId) === String(buyerId)) {
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       )
//     }

//     // ✅ Create Order
//     const now = new Date()
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity,
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: quantity * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     }

//     await orders.insertOne(order)

//     /* ======================================
//        1️⃣ Retailer Orders → Impact Distributor Inventory
//     ====================================== */
//     if (buyerRole === "retailer" && sellerRole === "distributor") {
//       const remainingQty = Math.max(0, (product.quantity || 0) - quantity)

//       await distributorInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : product.status,
//           },
//         }
//       )

//       await retailerInventory.insertOne({
//         productId: new ObjectId(order.productId),
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Retailer warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//     }

//     /* ======================================
//        2️⃣ Distributor Orders → Impact Manufacturer Inventory
//     ====================================== */
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (manufacturerItem) {
//         const remainingQty = Math.max(
//           0,
//           (manufacturerItem.quantity || 0) - quantity
//         )

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status:
//                 remainingQty <= 0 ? "out_of_stock" : manufacturerItem.status,
//             },
//           }
//         )

//         await distributorInventory.insertOne({
//           productId: new ObjectId(order.productId),
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         })
//       }
//     }

//     /* ======================================
//        3️⃣ Customer Orders → Impact Retailer Inventory
//     ====================================== */
//     if (buyerRole === "customer" && sellerRole === "retailer") {
//       const retailerItem = await retailerInventory.findOne({
//         _id: new ObjectId(product._id),
//       })

//       if (retailerItem) {
//         const remainingQty = Math.max(0, (retailerItem.quantity || 0) - quantity)

//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status: remainingQty <= 0 ? "out_of_stock" : "available",
//             },
//           }
//         )
//       }
//     }

//     return NextResponse.json(
//       { message: "✅ Order created successfully", order },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("❌ POST /api/orders error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// import { NextRequest, NextResponse } from "next/server"
// import { getDatabase } from "@/lib/mongodb"
// import { ObjectId } from "mongodb"
// import { verifyAuth } from "@/lib/auth"
// import type { Order } from "@/lib/models/Order"

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 })

//     const user = auth.user!
//     const db = await getDatabase()
//     const ordersCollection = db.collection<Order>("orders")

//     const role = user.role.toLowerCase()
//     const userId = new ObjectId(user._id)

//     let filter: Record<string, any> = {}

//     switch (role) {
//       case "farmer":
//       case "manufacturer":
//       case "distributor":
//       case "retailer":
//       case "customer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: role },
//             { buyerId: userId, buyerRole: role },
//           ],
//         }
//         break
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray()

//     return NextResponse.json({ orders })
//   } catch (error) {
//     console.error("GET /api/orders error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// /* ======================================
//    POST → Create new order
//    - automatically reads pricePerUnit from seller's inventory
//    - updates inventories accordingly
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const user = auth.user!
//     const { productId, quantity, shippingAddress } = await request.json()

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 })

//     const db = await getDatabase()
//     const products = db.collection("products")
//     const manufacturerInventory = db.collection("manufacturer_inventory")
//     const distributorInventory = db.collection("distributor_inventory")
//     const retailerInventory = db.collection("retailer_inventory")
//     const orders = db.collection<Order>("orders")

//     const buyerRole = user.role.toLowerCase() as Order["buyerRole"]
//     const buyerId = new ObjectId(user._id)
//     const buyerName = user.name

//     let product: any = null
//     let sellerId: ObjectId
//     let sellerName = ""
//     let sellerRole: Order["sellerRole"]
//     let pricePerUnit = 0 // price that will be used for the order

//     // ✅ Fetch correct product source and seller based on buyer role
//     if (buyerRole === "distributor") {
//       // distributor ordering from manufacturer inventory
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "manufacturer" as Order["sellerRole"]
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     } else if (buyerRole === "retailer") {
//       // retailer ordering from distributor inventory
//       product = await distributorInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "distributor" as Order["sellerRole"]
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     } else if (buyerRole === "customer") {
//       // customer ordering from retailer inventory (public buy)
//       product = await retailerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "retailer" as Order["sellerRole"]
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     } else {
//       // default: someone buying directly from products collection (e.g., manufacturer buying from farmer via products)
//       product = await products.findOne({ _id: new ObjectId(productId) })
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "farmer" as Order["sellerRole"]
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     }

//     // double-check product found
//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 })

//     if (String(sellerId) === String(buyerId)) {
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       )
//     }

//     // ✅ Create Order using seller's pricePerUnit
//     const now = new Date()
//     const resolvedProductId = new ObjectId(product.productId || product._id)
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: resolvedProductId,
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: Number(pricePerUnit) || 0,
//       totalAmount: Number(quantity) * (Number(pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     }

//     const insertResult = await orders.insertOne(order)

//     /* ======================================
//        1️⃣ Retailer Orders → Impact Distributor Inventory
//     ====================================== */
//     if (buyerRole === "retailer" && sellerRole === "distributor") {
//       const remainingQty = Math.max(0, (product.quantity || 0) - Number(quantity))

//       // update distributor inventory item by _id (product could be inventory doc)
//       await distributorInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : product.status,
//           },
//         }
//       )

//       // add pending item to retailer inventory (price carried over)
//       await retailerInventory.insertOne({
//         productId: resolvedProductId,
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Retailer warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//     }

//     /* ======================================
//        2️⃣ Distributor Orders → Impact Manufacturer Inventory
//     ====================================== */
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (manufacturerItem) {
//         const remainingQty = Math.max(0, (manufacturerItem.quantity || 0) - Number(quantity))

//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status:
//                 remainingQty <= 0 ? "out_of_stock" : manufacturerItem.status,
//             },
//           }
//         )

//         // Insert into distributor inventory with the manufacturer's pricePerUnit
//         await distributorInventory.insertOne({
//           productId: resolvedProductId,
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor warehouse",
//           status: "pending",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         })
//       }
//     }

//     /* ======================================
//        3️⃣ Customer Orders → Impact Retailer Inventory
//     ====================================== */
//     if (buyerRole === "customer" && sellerRole === "retailer") {
//       const retailerItem = await retailerInventory.findOne({
//         _id: new ObjectId(product._id),
//       })

//       if (retailerItem) {
//         const remainingQty = Math.max(0, (retailerItem.quantity || 0) - Number(quantity))

//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status: remainingQty <= 0 ? "out_of_stock" : "available",
//             },
//           }
//         )
//       }
//     }

//     // return inserted order + id for frontend convenience
//     return NextResponse.json(
//       { message: "✅ Order created successfully", order: { ...order, _id: insertResult.insertedId } },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("❌ POST /api/orders error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// // }
// import { NextRequest, NextResponse } from "next/server"
// import { getDatabase } from "@/lib/mongodb"
// import { ObjectId } from "mongodb"
// import { verifyAuth } from "@/lib/auth"
// import type { Order } from "@/lib/models/Order"

// /* ======================================
//    GET → Fetch all orders
// ====================================== */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 })

//     const user = auth.user!
//     const db = await getDatabase()
//     const ordersCollection = db.collection<Order>("orders")

//     const role = user.role.toLowerCase()
//     const userId = new ObjectId(user._id)

//     let filter: Record<string, any> = {}

//     switch (role) {
//       case "farmer":
//       case "manufacturer":
//       case "distributor":
//       case "retailer":
//       case "customer":
//         filter = {
//           $or: [
//             { sellerId: userId, sellerRole: role },
//             { buyerId: userId, buyerRole: role },
//           ],
//         }
//         break
//       default:
//         return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     const orders = await ordersCollection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray()

//     return NextResponse.json({ orders })
//   } catch (error) {
//     console.error("GET /api/orders error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// /* ======================================
//    POST → Create new order
//    - automatically reads pricePerUnit from seller's inventory
//    - updates inventories accordingly
// ====================================== */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const user = auth.user!
//     const { productId, quantity, shippingAddress } = await request.json()

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 })

//     const db = await getDatabase()
//     const products = db.collection("products")
//     const manufacturerInventory = db.collection("manufacturer_inventory")
//     const distributorInventory = db.collection("distributor_inventory")
//     const retailerInventory = db.collection("retailer_inventory")
//     const orders = db.collection<Order>("orders")

//     const buyerRole = user.role.toLowerCase() as Order["buyerRole"]
//     const buyerId = new ObjectId(user._id)
//     const buyerName = user.name

//     let product: any = null
//     let sellerId: ObjectId
//     let sellerName = ""
//     let sellerRole: Order["sellerRole"]
//     let pricePerUnit = 0

//     // ✅ Fetch correct product source and seller based on buyer role
//     if (buyerRole === "distributor") {
//       // Distributor → Manufacturer
//       product = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "manufacturer"
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     } else if (buyerRole === "retailer") {
//       // Retailer → Distributor
//       product = await distributorInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "distributor"
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     } else if (buyerRole === "customer") {
//       // Customer → Retailer
//       product = await retailerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "retailer"
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     } else {
//       // Manufacturer → Farmer (base product)
//       product = await products.findOne({ _id: new ObjectId(productId) })
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 })

//       sellerId = new ObjectId(product.ownerId)
//       sellerName = product.ownerName
//       sellerRole = "farmer"
//       pricePerUnit = Number(product.pricePerUnit) || 0
//     }

//     if (String(sellerId) === String(buyerId)) {
//       return NextResponse.json(
//         { error: "Invalid order: buyer and seller cannot be the same user" },
//         { status: 400 }
//       )
//     }

//     // ✅ Create Order
//     const now = new Date()
//     const resolvedProductId = new ObjectId(product.productId || product._id)
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId,
//       buyerName,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: resolvedProductId,
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: Number(pricePerUnit) || 0,
//       totalAmount: Number(quantity) * (Number(pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     }

//     const insertResult = await orders.insertOne(order)

//     /* ======================================
//        🌾 Manufacturer Orders → Impact Farmer Products
//        (Manufacturer buying directly from farmer)
//     ====================================== */
//     if (buyerRole === "manufacturer" && sellerRole === "farmer") {
//       await manufacturerInventory.insertOne({
//         productId: resolvedProductId,
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Manufacturer Warehouse",
//         status: "pending", // waiting for farmer to deliver
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })

//       // Optional: reduce farmer's available stock in products
//       await products.updateOne(
//         { _id: new ObjectId(productId) },
//         {
//           $inc: { quantity: -Number(quantity) },
//           $set: { updatedAt: new Date() },
//         }
//       )
//     }

//     /* ======================================
//        🏭 Distributor Orders → Impact Manufacturer Inventory
//     ====================================== */
//     if (buyerRole === "distributor" && sellerRole === "manufacturer") {
//       const manufacturerItem = await manufacturerInventory.findOne({
//         $or: [
//           { _id: new ObjectId(productId) },
//           { productId: new ObjectId(productId) },
//         ],
//       })

//       if (manufacturerItem) {
//         const remainingQty = Math.max(0, (manufacturerItem.quantity || 0) - Number(quantity))
//         await manufacturerInventory.updateOne(
//           { _id: manufacturerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status:
//                 remainingQty <= 0 ? "out_of_stock" : manufacturerItem.status,
//             },
//           }
//         )

//         await distributorInventory.insertOne({
//           productId: resolvedProductId,
//           productName: manufacturerItem.productName,
//           supplierId: new ObjectId(sellerId),
//           supplierName: sellerName,
//           batchNumber: manufacturerItem.batchNumber || `BATCH-${Date.now()}`,
//           quantity: Number(quantity),
//           unit: manufacturerItem.unit || "unit",
//           pricePerUnit: Number(manufacturerItem.pricePerUnit) || 0,
//           location: "Distributor Warehouse",
//           status: "pending",
//           ownerId: new ObjectId(buyerId),
//           ownerName: buyerName,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         })
//       }
//     }

//     /* ======================================
//        🚚 Retailer Orders → Impact Distributor Inventory
//     ====================================== */
//     if (buyerRole === "retailer" && sellerRole === "distributor") {
//       const remainingQty = Math.max(0, (product.quantity || 0) - Number(quantity))
//       await distributorInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : product.status,
//           },
//         }
//       )

//       await retailerInventory.insertOne({
//         productId: resolvedProductId,
//         productName: order.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(product.pricePerUnit) || 0,
//         location: "Retailer Warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: buyerName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//     }

//     /* ======================================
//        🛒 Customer Orders → Impact Retailer Inventory
//     ====================================== */
//     if (buyerRole === "customer" && sellerRole === "retailer") {
//       const retailerItem = await retailerInventory.findOne({
//         _id: new ObjectId(product._id),
//       })

//       if (retailerItem) {
//         const remainingQty = Math.max(0, (retailerItem.quantity || 0) - Number(quantity))
//         await retailerInventory.updateOne(
//           { _id: retailerItem._id },
//           {
//             $set: {
//               quantity: remainingQty,
//               updatedAt: new Date(),
//               status: remainingQty <= 0 ? "out_of_stock" : "available",
//             },
//           }
//         )
//       }
//     }

//     return NextResponse.json(
//       { message: "✅ Order created successfully", order: { ...order, _id: insertResult.insertedId } },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("❌ POST /api/orders error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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

//     // ==========================================================
//     // 🧑‍🌾 FARMER → MANUFACTURER FLOW
//     // ==========================================================
//     if (role === "farmer") {
//       console.log("👨‍🌾 Farmer updating order:", order.orderNumber, "to status:", status);

//       // 🟡 When shipped → reduce farmer stock
//       if (status === "shipped") {
//         await farmerInventory.updateOne(
//           { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//           { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//         );
//       }

//       // ✅ When delivered → add/update manufacturer inventory as available
//       if (status === "delivered") {
//         const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//         console.log("✅ Farmer delivered product:", order.productName);

//         const existingManufacturerItem = await manufacturerInventory.findOne({
//           productId: new ObjectId(order.productId),
//           ownerId: new ObjectId(order.buyerId),
//         });

//         if (existingManufacturerItem) {
//           console.log("🟢 Updating existing manufacturer inventory item");
//           await manufacturerInventory.updateOne(
//             { _id: existingManufacturerItem._id },
//             {
//               $inc: { quantity: order.quantity },
//               $set: {
//                 updatedAt: now,
//                 pricePerUnit: sellingPrice,
//                 status: "available", // ✅ MAKE AVAILABLE
//               },
//             }
//           );
//         } else {
//           console.log("🟢 Inserting new manufacturer inventory item");
//           await manufacturerInventory.insertOne({
//             productId: new ObjectId(order.productId),
//             productName: order.productName,
//             supplierId: new ObjectId(order.sellerId),
//             supplierName: order.sellerName,
//             quantity: order.quantity,
//             unit: order.unit,
//             pricePerUnit: sellingPrice,
//             location: "Manufacturer Warehouse",
//             status: "available", // ✅ MARK AS AVAILABLE
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
//       console.log("🏭 Manufacturer updating order:", order.orderNumber, "to status:", status);

//       if (status === "shipped") {
//         const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

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
//     if (role === "distributor" && status === "shipped") {
//       const sellingPrice = Number(pricePerUnit) || Number(order.pricePerUnit) || 0;

//       await distributorInventory.updateOne(
//         { productId: order.productId, ownerId: new ObjectId(order.sellerId) },
//         { $inc: { quantity: -order.quantity }, $set: { updatedAt: now } }
//       );

//       const existingRetail = await retailerInventory.findOne({
//         productId: order.productId,
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
//           productId: order.productId,
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
//       const retailerItem = await retailerInventory.findOne({
//         productId: order.productId,
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
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";
// import type { Order } from "@/lib/models/Order";

// /* ================================================================
//    ✅ GET → Fetch all orders for the logged-in user
// ================================================================ */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const role = user.role.toLowerCase();
//     const userId = new ObjectId(user._id);

//     // ✅ Type-safe filter for MongoDB
//     const filter: Record<string, any> = {
//       $or: [
//         { sellerId: userId, sellerRole: role },
//         { buyerId: userId, buyerRole: role },
//       ],
//     };

//     const orders = await ordersCollection
//       .find(filter as any) // 👈 safe cast for MongoDB type checking
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/orders error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// /* ================================================================
//    ✅ POST → Create a new order (any role → next role)
// ================================================================ */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const db = await getDatabase();
//     const body = await request.json();
//     const { productId, quantity, shippingAddress } = body;

//     if (!productId || !quantity)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const user = auth.user!;
//     const buyerRole = user.role.toLowerCase();
//     const buyerId = new ObjectId(user._id);

//     // Collections
//     const products = db.collection("products");
//     const farmerInventory = db.collection("farmer_inventory");
//     const manufacturerInventory = db.collection("manufacturer_inventory");
//     const distributorInventory = db.collection("distributor_inventory");
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     let product: any = null;
//     let sellerId: ObjectId;
//     let sellerName = "";
//     let sellerRole: Order["sellerRole"];
//     let pricePerUnit = 0;

//     // ============================================================
//     // 🧑‍🌾 MANUFACTURER BUYS FROM FARMER
//     // ============================================================
//     if (buyerRole === "manufacturer") {
//       product = await products.findOne({ _id: new ObjectId(productId) });
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 });

//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "farmer";
//       pricePerUnit = Number(product.pricePerUnit) || 0;

//       // Reduce farmer’s stock
//       await products.updateOne(
//         { _id: new ObjectId(productId) },
//         { $inc: { quantity: -Number(quantity) }, $set: { updatedAt: new Date() } }
//       );
//     }

//     // ============================================================
//     // 🏭 DISTRIBUTOR BUYS FROM MANUFACTURER INVENTORY
//     // ============================================================
//     else if (buyerRole === "distributor") {
//       product = await manufacturerInventory.findOne({
//         $or: [{ _id: new ObjectId(productId) }, { productId: new ObjectId(productId) }],
//       });
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 });

//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "manufacturer";
//       pricePerUnit = Number(product.pricePerUnit) || 0;

//       const remainingQty = Math.max(0, (product.quantity || 0) - Number(quantity));
//       await manufacturerInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : "available",
//           },
//         }
//       );

//       await distributorInventory.insertOne({
//         productId: new ObjectId(product.productId || product._id),
//         productName: product.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(pricePerUnit),
//         location: "Distributor Warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: user.name,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     // ============================================================
//     // 🚚 RETAILER BUYS FROM DISTRIBUTOR
//     // ============================================================
//     else if (buyerRole === "retailer") {
//       product = await distributorInventory.findOne({
//         $or: [{ _id: new ObjectId(productId) }, { productId: new ObjectId(productId) }],
//       });
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 });

//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "distributor";
//       pricePerUnit = Number(product.pricePerUnit) || 0;

//       const remainingQty = Math.max(0, (product.quantity || 0) - Number(quantity));
//       await distributorInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : "available",
//           },
//         }
//       );

//       await retailerInventory.insertOne({
//         productId: new ObjectId(product.productId || product._id),
//         productName: product.productName,
//         supplierId: new ObjectId(sellerId),
//         supplierName: sellerName,
//         batchNumber: `BATCH-${Date.now()}`,
//         quantity: Number(quantity),
//         unit: product.unit || "unit",
//         pricePerUnit: Number(pricePerUnit),
//         location: "Retailer Warehouse",
//         status: "pending",
//         ownerId: new ObjectId(buyerId),
//         ownerName: user.name,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     // ============================================================
//     // 🛒 CUSTOMER BUYS FROM RETAILER
//     // ============================================================
//     else if (buyerRole === "customer") {
//       product = await retailerInventory.findOne({
//         $or: [{ _id: new ObjectId(productId) }, { productId: new ObjectId(productId) }],
//       });
//       if (!product)
//         return NextResponse.json({ error: "Product not found" }, { status: 404 });

//       sellerId = new ObjectId(product.ownerId);
//       sellerName = product.ownerName;
//       sellerRole = "retailer";
//       pricePerUnit = Number(product.pricePerUnit) || 0;

//       const remainingQty = Math.max(0, (product.quantity || 0) - Number(quantity));
//       await retailerInventory.updateOne(
//         { _id: product._id },
//         {
//           $set: {
//             quantity: remainingQty,
//             updatedAt: new Date(),
//             status: remainingQty <= 0 ? "out_of_stock" : "available",
//           },
//         }
//       );
//     } else {
//       return NextResponse.json({ error: "Invalid buyer role" }, { status: 403 });
//     }

//     // ============================================================
//     // ✅ Create and save Order
//     // ============================================================
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
//       buyerId,
//       buyerName: user.name,
//       buyerRole,
//       sellerId,
//       sellerName,
//       sellerRole,
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || product.name || "Unnamed Product",
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit,
//       totalAmount: Number(quantity) * pricePerUnit,
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Address not provided",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     return NextResponse.json(
//       {
//         message: "✅ Order created successfully",
//         orderId: result.insertedId,
//         totalAmount: order.totalAmount,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/orders error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import type { Order } from "@/lib/models/Order";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    const db = await getDatabase();
    const ordersCollection = db.collection<Order>("orders");

    const role = user.role.toLowerCase();
    const userId = new ObjectId(user._id);

    const filter = {
      $or: [
        { sellerId: userId, sellerRole: role },
        { buyerId: userId, buyerRole: role },
      ],
    };

    const orders = await ordersCollection.find(filter as any).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDatabase();
    const body = await request.json();
    const { productId, quantity, shippingAddress } = body;

    if (!productId || !quantity)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = auth.user!;
    const buyerRole = user.role.toLowerCase();
    const buyerId = new ObjectId(user._id);

    const products = db.collection("products");
    const farmerInventory = db.collection("farmer_inventory");
    const manufacturerInventory = db.collection("manufacturer_inventory");
    const distributorInventory = db.collection("distributor_inventory");
    const retailerInventory = db.collection("retailer_inventory");
    const orders = db.collection<Order>("orders");

    let product: any = null;
    let sellerId: ObjectId;
    let sellerName = "";
    let sellerRole: Order["sellerRole"];
    let pricePerUnit = 0;

    // ============================================================
    // 🧑‍🌾 MANUFACTURER BUYS FROM FARMER
    // ============================================================
    if (buyerRole === "manufacturer") {
      product = await products.findOne({ _id: new ObjectId(productId) });
      if (!product)
        return NextResponse.json({ error: "Product not found" }, { status: 404 });

      sellerId = new ObjectId(product.ownerId);
      sellerName = product.ownerName;
      sellerRole = "farmer";
      pricePerUnit = Number(product.pricePerUnit) || 0;

      const now = new Date();

      // ✅ Make sure this product exists in farmer_inventory (if not, insert it)
      const existingFarmerItem = await farmerInventory.findOne({
        productId: new ObjectId(product._id),
        ownerId: sellerId,
      });

      if (!existingFarmerItem) {
        await farmerInventory.insertOne({
          productId: new ObjectId(product._id),
          productName: product.name || product.productName,
          supplierId: sellerId,
          supplierName: sellerName,
          quantity: product.quantity || 0,
          unit: product.unit || "unit",
          pricePerUnit: pricePerUnit,
          location: "Farmer Warehouse",
          status: "available",
          ownerId: sellerId,
          ownerName: sellerName,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // ============================================================
    // 🏭 DISTRIBUTOR BUYS FROM MANUFACTURER INVENTORY
    // ============================================================
    else if (buyerRole === "distributor") {
      product = await manufacturerInventory.findOne({
        $or: [{ _id: new ObjectId(productId) }, { productId: new ObjectId(productId) }],
      });
      if (!product)
        return NextResponse.json({ error: "Product not found" }, { status: 404 });

      sellerId = new ObjectId(product.ownerId);
      sellerName = product.ownerName;
      sellerRole = "manufacturer";
      pricePerUnit = Number(product.pricePerUnit) || 0;

      const remainingQty = Math.max(0, (product.quantity || 0) - Number(quantity));
      await manufacturerInventory.updateOne(
        { _id: product._id },
        {
          $set: {
            quantity: remainingQty,
            updatedAt: new Date(),
            status: remainingQty <= 0 ? "out_of_stock" : "available",
          },
        }
      );

      await distributorInventory.insertOne({
        productId: new ObjectId(product.productId || product._id),
        productName: product.productName,
        supplierId: new ObjectId(sellerId),
        supplierName: sellerName,
        batchNumber: `BATCH-${Date.now()}`,
        quantity: Number(quantity),
        unit: product.unit || "unit",
        pricePerUnit: Number(pricePerUnit),
        location: "Distributor Warehouse",
        status: "pending",
        ownerId: new ObjectId(buyerId),
        ownerName: user.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // ============================================================
    // 🚚 RETAILER BUYS FROM DISTRIBUTOR
    // ============================================================
    else if (buyerRole === "retailer") {
      product = await distributorInventory.findOne({
        $or: [{ _id: new ObjectId(productId) }, { productId: new ObjectId(productId) }],
      });
      if (!product)
        return NextResponse.json({ error: "Product not found" }, { status: 404 });

      sellerId = new ObjectId(product.ownerId);
      sellerName = product.ownerName;
      sellerRole = "distributor";
      pricePerUnit = Number(product.pricePerUnit) || 0;
    }

    // ============================================================
    // 🛒 CUSTOMER BUYS FROM RETAILER
    // ============================================================
    else if (buyerRole === "customer") {
      product = await retailerInventory.findOne({
        $or: [{ _id: new ObjectId(productId) }, { productId: new ObjectId(productId) }],
      });
      if (!product)
        return NextResponse.json({ error: "Product not found" }, { status: 404 });

      sellerId = new ObjectId(product.ownerId);
      sellerName = product.ownerName;
      sellerRole = "retailer";
      pricePerUnit = Number(product.pricePerUnit) || 0;
    } else {
      return NextResponse.json({ error: "Invalid buyer role" }, { status: 403 });
    }

    // ============================================================
    // ✅ Create and Save Order
    // ============================================================
    const now = new Date();
    const order: Omit<Order, "_id"> = {
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      buyerId,
      buyerName: user.name,
      buyerRole,
      sellerId,
      sellerName,
      sellerRole,
      productId: new ObjectId(product.productId || product._id),
      productName: product.productName || product.name || "Unnamed Product",
      quantity: Number(quantity),
      unit: product.unit || "unit",
      pricePerUnit,
      totalAmount: Number(quantity) * pricePerUnit,
      status: "pending",
      orderDate: now,
      shippingAddress: shippingAddress || "Address not provided",
      createdAt: now,
      updatedAt: now,
    };

    const result = await orders.insertOne(order);

    return NextResponse.json(
      {
        message: "✅ Order created successfully",
        orderId: result.insertedId,
        totalAmount: order.totalAmount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
