// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";
// import type { Order } from "@/lib/models/Order";

// /**
//  * ======================================
//  * GET → Fetch Customer Orders (Retailer side)
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
//         { error: "Access denied: Only retailers can view customer orders." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const retailerId = new ObjectId(String(user._id));
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");

//     // ✅ Only fetch orders where retailer is the seller
//     const query: Record<string, any> = {
//       sellerId: retailerId,
//       sellerRole: "retailer",
//     };

//     if (status) query.status = status;

//     const customerOrders = await ordersCollection
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders: customerOrders }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/retailer/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Create New Customer Order
//  * (Customer → Retailer)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { productId, quantity, customerName, shippingAddress } = body;

//     if (!productId || !quantity || !customerName) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     const product = await retailerInventory.findOne({
//       _id: new ObjectId(productId),
//     });

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Build order object (Customer → Retailer)
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId: null, // No registered customer account (optional)
//       buyerName: customerName,
//       buyerRole: "customer",
//       sellerId: product.ownerId,
//       sellerName: product.ownerName,
//       sellerRole: "retailer",
//       productId: new ObjectId(productId),
//       productName: product.productName,
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: product.pricePerUnit || 0,
//       totalAmount: Number(quantity) * (product.pricePerUnit || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Customer-provided address",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ Reduce retailer stock
//     await retailerInventory.updateOne(
//       { _id: new ObjectId(productId) },
//       {
//         $inc: { quantity: -Number(quantity) },
//         $set: { updatedAt: now },
//       }
//     );

//     return NextResponse.json(
//       { message: "Order placed successfully", orderId: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/retailer/orders error:", error);
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
// import type { Order } from "@/lib/models/Order";

// /**
//  * ======================================
//  * GET → Fetch Customer Orders (Retailer side)
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
//         { error: "Access denied: Only retailers can view customer orders." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const retailerId = new ObjectId(String(user._id));
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");

//     const query: Record<string, any> = {
//       sellerId: retailerId,
//       sellerRole: "retailer",
//     };

//     if (status) query.status = status;

//     const customerOrders = await ordersCollection
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders: customerOrders }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/retailer/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Create New Customer Order (Customer → Retailer)
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
//         { error: "Access denied: Only retailers can create customer orders." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const { productId, quantity, customerName, shippingAddress } = body;

//     if (!productId || !quantity || !customerName) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     const product = await retailerInventory.findOne({
//       _id: new ObjectId(productId),
//     });

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Build order object
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId: new ObjectId("000000000000000000000000"), // placeholder ID for guest
//  // anonymous customer
//       buyerName: customerName,
//       buyerRole: "customer",
//       sellerId: new ObjectId(user._id),
//       sellerName: user.name,
//       sellerRole: "retailer",
//       productId: new ObjectId(productId),
//       productName: product.productName,
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: product.pricePerUnit || 0,
//       totalAmount: Number(quantity) * (product.pricePerUnit || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress: shippingAddress || "Customer-provided address",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ Reduce retailer stock safely
//     await retailerInventory.updateOne(
//       { _id: new ObjectId(productId) },
//       {
//         $inc: { quantity: -Number(quantity) },
//         $set: { updatedAt: now },
//       }
//     );

//     return NextResponse.json(
//       { message: "Customer order placed successfully", orderId: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/retailer/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



// import { NextRequest, NextResponse } from "next/server"
// import { getDatabase } from "@/lib/mongodb"
// import { verifyAuth } from "@/lib/auth"
// import { ObjectId } from "mongodb"
// import type { Order } from "@/lib/models/Order"

// /**
//  * ======================================
//  * GET → Fetch all Customer Orders (for Retailer Dashboard)
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const user = auth.user!
//     if (user.role.toLowerCase() !== "retailer") {
//       return NextResponse.json(
//         { error: "Access denied: Only retailers can view customer orders." },
//         { status: 403 }
//       )
//     }

//     const db = await getDatabase()
//     const ordersCollection = db.collection<Order>("orders")

//     const retailerId = new ObjectId(String(user._id))
//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get("status")

//     const query: Record<string, any> = {
//       sellerId: retailerId,
//       sellerRole: "retailer",
//     }

//     if (status) query.status = status

//     const customerOrders = await ordersCollection
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray()

//     return NextResponse.json({ orders: customerOrders }, { status: 200 })
//   } catch (error) {
//     console.error("❌ GET /api/retailer/orders error:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

// /**
//  * ======================================
//  * POST → Customer Buys Product (Customer → Retailer)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const user = auth.user!
//     if (user.role.toLowerCase() !== "customer") {
//       return NextResponse.json(
//         { error: "Access denied: Only customers can place orders." },
//         { status: 403 }
//       )
//     }

//     const body = await request.json()
//     const { productId, quantity, shippingAddress } = body

//     if (!productId || !quantity) {
//       return NextResponse.json(
//         { error: "Missing required fields (productId, quantity)" },
//         { status: 400 }
//       )
//     }

//     const db = await getDatabase()
//     const retailerInventory = db.collection("retailer_inventory")
//     const orders = db.collection<Order>("orders")

//     const product = await retailerInventory.findOne({
//       _id: new ObjectId(productId),
//     })

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 })

//     // ✅ Verify enough stock
//     if (product.quantity < quantity) {
//       return NextResponse.json(
//         { error: "Not enough stock available" },
//         { status: 400 }
//       )
//     }

//     // ✅ Build order object
//     const now = new Date()
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId: new ObjectId(user._id),
//       buyerName: user.name,
//       buyerRole: "customer",
//       sellerId: new ObjectId(product.ownerId),
//       sellerName: product.ownerName,
//       sellerRole: "retailer",
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || "Unnamed Product",
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: Number(quantity) * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress:
//         shippingAddress || "Customer-provided address not specified",
//       createdAt: now,
//       updatedAt: now,
//     }

//     // ✅ Insert order
//     const result = await orders.insertOne(order)

//     // ✅ Decrease retailer stock
//     const remainingQty = Math.max(0, (product.quantity || 0) - quantity)
//     await retailerInventory.updateOne(
//       { _id: new ObjectId(productId) },
//       {
//         $set: {
//           quantity: remainingQty,
//           updatedAt: now,
//           status: remainingQty <= 0 ? "out_of_stock" : product.status,
//         },
//       }
//     )

//     return NextResponse.json(
//       {
//         message: "✅ Order placed successfully",
//         orderId: result.insertedId,
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("❌ POST /api/retailer/orders error:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";
// import type { Order } from "@/lib/models/Order";

// /**
//  * ======================================
//  * GET → Fetch all Customer Orders (Retailer Dashboard)
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
//         { error: "Access denied: Only retailers can view customer orders." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const retailerId = new ObjectId(String(user._id));
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");

//     const query: Record<string, any> = {
//       sellerId: retailerId,
//       sellerRole: { $regex: /^retailer$/i }, // ✅ case-insensitive
//     };

//     if (status && status !== "all") query.status = status;

//     const customerOrders = await ordersCollection
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders: customerOrders }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/retailer/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Customer Buys Product (Customer → Retailer)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "customer") {
//       return NextResponse.json(
//         { error: "Access denied: Only customers can place orders." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const { productId, quantity, shippingAddress } = body;

//     if (!productId || !quantity) {
//       return NextResponse.json(
//         { error: "Missing required fields (productId, quantity)" },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     const product = await retailerInventory.findOne({
//       _id: new ObjectId(productId),
//     });

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Ensure enough stock
//     if (product.quantity < quantity) {
//       return NextResponse.json(
//         { error: "Not enough stock available" },
//         { status: 400 }
//       );
//     }

//     // ✅ Build order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId: new ObjectId(user._id),
//       buyerName: user.name,
//       buyerRole: "customer",
//       sellerId: new ObjectId(product.ownerId),
//       sellerName: product.ownerName,
//       sellerRole: "retailer",
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || "Unnamed Product",
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: Number(quantity) * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress:
//         shippingAddress || "Customer-provided address not specified",
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await orders.insertOne(order);

//     // ✅ Reduce retailer stock
//     const remainingQty = Math.max(0, (product.quantity || 0) - quantity);
//     await retailerInventory.updateOne(
//       { _id: new ObjectId(productId) },
//       {
//         $set: {
//           quantity: remainingQty,
//           updatedAt: now,
//           status: remainingQty <= 0 ? "out_of_stock" : "available",
//         },
//       }
//     );

//     return NextResponse.json(
//       { message: "✅ Order placed successfully", orderId: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/retailer/orders error:", error);
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
// import type { Order } from "@/lib/models/Order";
// import { addTraceabilityRecord } from "@/lib/services/traceability-service";

// /**
//  * ======================================
//  * GET → Fetch all Customer Orders (Retailer Dashboard)
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
//         { error: "Access denied: Only retailers can view customer orders." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const ordersCollection = db.collection<Order>("orders");

//     const retailerId = new ObjectId(String(user._id));
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");

//     const query: Record<string, any> = {
//       sellerId: retailerId,
//       sellerRole: { $regex: /^retailer$/i }, // ✅ case-insensitive
//     };

//     if (status && status !== "all") query.status = status;

//     const customerOrders = await ordersCollection
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return NextResponse.json({ orders: customerOrders }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/retailer/orders error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Customer Buys Product (Customer → Retailer)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user!;
//     if (user.role.toLowerCase() !== "customer") {
//       return NextResponse.json(
//         { error: "Access denied: Only customers can place orders." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const { productId, quantity, shippingAddress } = body;

//     if (!productId || !quantity) {
//       return NextResponse.json(
//         { error: "Missing required fields (productId, quantity)" },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const retailerInventory = db.collection("retailer_inventory");
//     const orders = db.collection<Order>("orders");

//     // ✅ Find product from retailer inventory
//     const product = await retailerInventory.findOne({
//       _id: new ObjectId(productId),
//     });

//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     // ✅ Check stock
//     if (product.quantity < quantity) {
//       return NextResponse.json(
//         { error: "Not enough stock available" },
//         { status: 400 }
//       );
//     }

//     // ✅ Build new order
//     const now = new Date();
//     const order: Omit<Order, "_id"> = {
//       orderNumber: `ORD-${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase()}`,
//       buyerId: new ObjectId(user._id),
//       buyerName: user.name,
//       buyerRole: "customer",
//       sellerId: new ObjectId(product.ownerId),
//       sellerName: product.ownerName,
//       sellerRole: "retailer",
//       productId: new ObjectId(product.productId || product._id),
//       productName: product.productName || "Unnamed Product",
//       quantity: Number(quantity),
//       unit: product.unit || "unit",
//       pricePerUnit: Number(product.pricePerUnit) || 0,
//       totalAmount: Number(quantity) * (Number(product.pricePerUnit) || 0),
//       status: "pending",
//       orderDate: now,
//       shippingAddress:
//         shippingAddress || "Customer-provided address not specified",
//       createdAt: now,
//       updatedAt: now,
//     };

//     // ✅ Insert order
//     const result = await orders.insertOne(order);

//     // ✅ Reduce retailer stock
//     const remainingQty = Math.max(0, (product.quantity || 0) - quantity);
//     await retailerInventory.updateOne(
//       { _id: new ObjectId(productId) },
//       {
//         $set: {
//           quantity: remainingQty,
//           updatedAt: now,
//           status: remainingQty <= 0 ? "out_of_stock" : "available",
//         },
//       }
//     );

//     // ✅ Traceability record
//     try {
//       await addTraceabilityRecord({
//         productId: order.productId,
//         orderId: result.insertedId,
//         stage: "retail",
//         actorId: new ObjectId(user._id),
//         actorName: user.name,
//         actorRole: "customer",
//         location: {
//           name:
//             typeof shippingAddress === "object"
//               ? shippingAddress.city
//               : "Unknown",
//           address:
//             typeof shippingAddress === "object"
//               ? `${shippingAddress.street}, ${shippingAddress.state}, ${shippingAddress.country}`
//               : "Unknown",
//         },
//         action: "ordered",
//         description: "Customer placed an order for retail product",
//         verificationStatus: "pending",
//       });
//     } catch (e) {
//       console.error("Traceability insert failed:", e);
//     }

//     return NextResponse.json(
//       {
//         message: "✅ Order placed successfully",
//         orderId: result.insertedId,
//         totalAmount: order.totalAmount,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/retailer/orders error:", error);
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
import type { Order } from "@/lib/models/Order";
import { addTraceabilityRecord } from "@/lib/services/traceability-service";

/**
 * ======================================
 * GET → Fetch all Customer Orders (Retailer Dashboard)
 * ======================================
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "retailer") {
      return NextResponse.json(
        { error: "Access denied: Only retailers can view customer orders." },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>("orders");

    const retailerId = new ObjectId(String(user._id));
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: Record<string, any> = {
      sellerId: retailerId,
      sellerRole: { $regex: /^retailer$/i }, // ✅ case-insensitive
    };

    if (status && status !== "all") query.status = status;

    const customerOrders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders: customerOrders }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/retailer/orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * ======================================
 * POST → Customer Buys Product (Customer → Retailer)
 * ======================================
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "customer") {
      return NextResponse.json(
        { error: "Access denied: Only customers can place orders." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, quantity, shippingAddress } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields (productId, quantity)" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const retailerInventory = db.collection("retailer_inventory");
    const orders = db.collection<Order>("orders");

    // ✅ Find product in retailer inventory
    const product = await retailerInventory.findOne({
      _id: new ObjectId(productId),
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // ✅ Check stock
    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 400 }
      );
    }

    // ✅ Use retailer's set price for customer
    const retailerPrice = Number(product.pricePerUnit) || 0;
    const totalAmount = Number(quantity) * retailerPrice;

    // ✅ Build order
    const now = new Date();
    const order: Omit<Order, "_id"> = {
      orderNumber: `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      buyerId: new ObjectId(user._id),
      buyerName: user.name,
      buyerRole: "customer",
      sellerId: new ObjectId(product.ownerId),
      sellerName: product.ownerName,
      sellerRole: "retailer",
      productId: new ObjectId(product.productId || product._id),
      productName: product.productName || "Unnamed Product",
      quantity: Number(quantity),
      unit: product.unit || "unit",
      pricePerUnit: retailerPrice, // ✅ retailer’s custom price
      totalAmount: totalAmount, // ✅ total = retailer price * quantity
      status: "pending",
      orderDate: now,
      shippingAddress:
        shippingAddress || "Customer-provided address not specified",
      createdAt: now,
      updatedAt: now,
    };

    // ✅ Insert order
    const result = await orders.insertOne(order);

    // ✅ Reduce retailer stock
    const remainingQty = Math.max(0, (product.quantity || 0) - quantity);
    await retailerInventory.updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          quantity: remainingQty,
          updatedAt: now,
          status: remainingQty <= 0 ? "out_of_stock" : "available",
        },
      }
    );

    // ✅ Add traceability record
    try {
      await addTraceabilityRecord({
        productId: order.productId,
        orderId: result.insertedId,
        stage: "retail",
        actorId: new ObjectId(user._id),
        actorName: user.name,
        actorRole: user.role,
        location: {
          name:
            typeof shippingAddress === "object"
              ? shippingAddress.city
              : "Unknown",
          address:
            typeof shippingAddress === "object"
              ? `${shippingAddress.street}, ${shippingAddress.state}, ${shippingAddress.country}`
              : "Unknown",
        },
        action: "ordered",
        description: "Customer placed an order for retail product",
        verificationStatus: "pending",
      });
    } catch (e) {
      console.error("Traceability insert failed:", e);
    }

    return NextResponse.json(
      {
        message: "✅ Order placed successfully",
        orderId: result.insertedId,
        totalAmount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/retailer/orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
