// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyAuth } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// /**
//  * ======================================
//  * GET → Fetch all logistics shipments for distributor
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     // ✅ Verify user session
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user;
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can view logistics." },
//         { status: 403 }
//       );
//     }

//     const db = await getDatabase();
//     const logisticsCollection = db.collection("logistics");
//     const ordersCollection = db.collection("orders");

//     // ✅ Fetch all shipments belonging to this distributor
//     const shipments = await logisticsCollection
//       .find({ distributorId: new ObjectId(user._id) })
//       .sort({ createdAt: -1 })
//       .toArray();

//     // ✅ Enrich with order info (optional)
//     const orderIds = shipments.map((s) => new ObjectId(s.orderId));
//     const relatedOrders = await ordersCollection
//       .find({ _id: { $in: orderIds } })
//       .project({ orderNumber: 1 })
//       .toArray();

//     const orderMap = new Map(
//       relatedOrders.map((o) => [o._id.toString(), o.orderNumber])
//     );

//     const result = shipments.map((s) => ({
//       _id: s._id.toString(),
//       orderNumber:
//         s.orderNumber ||
//         orderMap.get(s.orderId?.toString()) ||
//         "ORD-UNKNOWN",
//       driverName: s.driverName || "Not Assigned",
//       vehicleType: s.vehicleType || "Truck",
//       temperature: s.temperature ?? 10,
//       departureTime: s.departureTime || new Date().toISOString(),
//       estimatedArrival: s.estimatedArrival || new Date().toISOString(),
//       currentLocation: s.currentLocation || "Warehouse",
//       status: s.status || "scheduled",
//     }));

//     return NextResponse.json({ shipments: result }, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/distributor/logistics error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * POST → Create / Update logistics entry
//  * (When distributor assigns a shipment)
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user;
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can create shipments." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const {
//       orderId,
//       driverName,
//       vehicleType,
//       departureTime,
//       estimatedArrival,
//       temperature,
//       currentLocation,
//       status,
//     } = body;

//     if (!orderId || !driverName || !vehicleType) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const logisticsCollection = db.collection("logistics");

//     const newShipment = {
//       orderId: new ObjectId(orderId),
//       distributorId: new ObjectId(user._id),
//       distributorName: user.name,
//       driverName,
//       vehicleType,
//       temperature: Number(temperature) || 10,
//       departureTime: departureTime ? new Date(departureTime) : new Date(),
//       estimatedArrival: estimatedArrival
//         ? new Date(estimatedArrival)
//         : new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hrs later by default
//       currentLocation: currentLocation || "Distributor Warehouse",
//       status: status || "scheduled",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await logisticsCollection.insertOne(newShipment);

//     return NextResponse.json(
//       { message: "Shipment created successfully", shipmentId: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/distributor/logistics error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * ======================================
//  * PATCH → Update live shipment details (real-time updates)
//  * ======================================
//  */
// export async function PATCH(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request);
//     if (!auth.success || !auth.user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = auth.user;
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can update shipments." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const { shipmentId, currentLocation, temperature, status } = body;

//     if (!shipmentId) {
//       return NextResponse.json(
//         { error: "Shipment ID required" },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const logisticsCollection = db.collection("logistics");

//     const updateFields: Record<string, any> = { updatedAt: new Date() };
//     if (currentLocation) updateFields.currentLocation = currentLocation;
//     if (temperature !== undefined)
//       updateFields.temperature = Number(temperature);
//     if (status) updateFields.status = status;

//     await logisticsCollection.updateOne(
//       { _id: new ObjectId(shipmentId) },
//       { $set: updateFields }
//     );

//     return NextResponse.json(
//       { message: "Shipment updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("PATCH /api/distributor/logistics error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
