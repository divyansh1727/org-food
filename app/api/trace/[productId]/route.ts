// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const db = await getDatabase();
//     const blockchain = db.collection("blockchain_ledger");

//     const productId = new ObjectId(params.productId);

//     const chain = await blockchain
//       .find({ productId })
//       .sort({ timestamp: 1 })
//       .toArray();

//     return NextResponse.json({ chain });
//   } catch (error) {
//     console.error("❌ GET /api/trace error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const db = await getDatabase();
//     const blockchain = db.collection("blockchain_ledger");

//     const { productId } = params;

//     // ✅ Validate ObjectId
//     let query: any = {};
//     if (ObjectId.isValid(productId)) {
//       query = {
//         $or: [
//           { productId: new ObjectId(productId) },
//           { productId: productId },
//         ],
//       };
//     } else {
//       query = { productId: productId };
//     }

//     // ✅ Fetch blockchain chain
//     const chain = await blockchain
//       .find(query)
//       .sort({ timestamp: 1 })
//       .toArray();

//     if (!chain || chain.length === 0) {
//       return NextResponse.json(
//         { message: "No blockchain records found for this product", chain: [] },
//         { status: 200 }
//       );
//     }

//     // ✅ Compute basic chain info (for debugging / frontend display)
//     const meta = {
//       totalBlocks: chain.length,
//       productId,
//       firstTimestamp: chain[0].timestamp,
//       lastTimestamp: chain[chain.length - 1].timestamp,
//       lastHash: chain[chain.length - 1].hash,
//     };

//     return NextResponse.json({ chain, meta }, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/trace/[productId] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const db = await getDatabase();
//     const blockchain = db.collection("blockchain_ledger");

//     const productIdParam = params.productId;

//     // 🔍 Support both ObjectId and string matching
//     const query = ObjectId.isValid(productIdParam)
//       ? {
//           $or: [
//             { productId: new ObjectId(productIdParam) },
//             { productId: productIdParam }, // fallback if stored as string
//           ],
//         }
//       : { productId: productIdParam };

//     const chain = await blockchain.find(query).sort({ timestamp: 1 }).toArray();

//     return NextResponse.json({ chain });
//   } catch (error) {
//     console.error("❌ GET /api/trace error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const db = await getDatabase();
//     const blockchain = db.collection("blockchain_ledger");

//     const productIdParam = params.productId;

//     // 🔍 Try to match any of the potential IDs (ObjectId or string)
//     const query = ObjectId.isValid(productIdParam)
//       ? {
//           $or: [
//             { productId: new ObjectId(productIdParam) },
//             { productId: productIdParam },
//             { orderId: new ObjectId(productIdParam) },
//             { orderId: productIdParam },
//           ],
//         }
//       : {
//           $or: [
//             { productId: productIdParam },
//             { orderId: productIdParam },
//           ],
//         };

//     const chain = await blockchain.find(query).sort({ timestamp: 1 }).toArray();

//     if (!chain || chain.length === 0) {
//       console.warn("⚠️ No blockchain data found for:", productIdParam);
//     } else {
//       console.log(`✅ Found ${chain.length} blockchain records for ${productIdParam}`);
//     }

//     return NextResponse.json({ chain });
//   } catch (error) {
//     console.error("❌ GET /api/trace error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const db = await getDatabase();
    const blockchain = db.collection("blockchain_ledger");

    const productIdParam = params.productId;

    console.log(`🔍 Incoming trace request for: ${productIdParam}`);

    // Build a query that checks multiple ID types
    const query = ObjectId.isValid(productIdParam)
      ? {
          $or: [
            { productId: new ObjectId(productIdParam) },
            { productId: productIdParam },
            { orderId: new ObjectId(productIdParam) },
            { orderId: productIdParam },
          ],
        }
      : {
          $or: [
            { productId: productIdParam },
            { orderId: productIdParam },
          ],
        };

    // Fetch blockchain records
    const chain = await blockchain.find(query).sort({ timestamp: 1 }).toArray();

    // 🧠 Detailed logging to understand which match worked
    if (!chain || chain.length === 0) {
      console.warn(`⚠️ No blockchain data found for: ${productIdParam}`);
    } else {
      console.log(`✅ Found ${chain.length} blockchain record(s) for ${productIdParam}`);
      // Log which fields matched
      const matchedFields = chain.map((c) => ({
        id: c._id.toString(),
        productId: c.productId?.toString?.() ?? c.productId,
        orderId: c.orderId?.toString?.() ?? c.orderId,
        actorRole: c.actorRole,
        action: c.action,
      }));
      console.table(matchedFields);
    }

    return NextResponse.json({ chain });
  } catch (error) {
    console.error("❌ GET /api/trace error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

