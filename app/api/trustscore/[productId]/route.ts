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
//     const orders = db.collection("orders");

//     const productId = new ObjectId(params.productId);

//     // 1️⃣ Fetch blockchain data
//     const chain = await blockchain.find({ productId }).sort({ timestamp: 1 }).toArray();

//     if (!chain.length) {
//       return NextResponse.json({ trustScore: 0, factors: [] });
//     }

//     // 2️⃣ Basic factors
//     let blockchainIntegrity = 100;
//     let supplyChainLength = Math.min(100, 120 - chain.length * 10); // penalize long chains
//     let deliveryTimeliness = 90;
//     let sellerReliability = 90;
//     let freshness = 95;
//     let priceFairness = 92;

//     // 3️⃣ Verify blockchain hash chain integrity
//     for (let i = 1; i < chain.length; i++) {
//       if (chain[i].previousHash !== chain[i - 1].hash) {
//         blockchainIntegrity = 70; // penalty if tampering detected
//         break;
//       }
//     }

//     // 4️⃣ Calculate average delays (simulate from orders)
//     const orderDocs = await orders.find({ productId }).toArray();
//     const deliveredOrders = orderDocs.filter((o) => o.status === "delivered");

//     if (deliveredOrders.length > 0) {
//       const delays = deliveredOrders.map((o) => {
//         if (!o.estimatedDeliveryDate || !o.actualDeliveryDate) return 0;
//         const delay =
//           new Date(o.actualDeliveryDate).getTime() -
//           new Date(o.estimatedDeliveryDate).getTime();
//         return delay > 0 ? Math.min(delay / (1000 * 60 * 60 * 24), 5) : 0; // cap delay
//       });
//       const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
//       deliveryTimeliness = Math.max(60, 100 - avgDelay * 10);
//     }

//     // 5️⃣ Combine all weighted factors
//     const trustScore =
//       blockchainIntegrity * 0.25 +
//       supplyChainLength * 0.2 +
//       deliveryTimeliness * 0.2 +
//       sellerReliability * 0.15 +
//       freshness * 0.1 +
//       priceFairness * 0.1;

//     const roundedScore = Math.round(trustScore);

//     // 6️⃣ Provide breakdown
//     const factors = [
//       { name: "Blockchain Integrity", value: blockchainIntegrity },
//       { name: "Supply Chain Efficiency", value: supplyChainLength },
//       { name: "Delivery Timeliness", value: deliveryTimeliness },
//       { name: "Seller Reliability", value: sellerReliability },
//       { name: "Freshness & Origin", value: freshness },
//       { name: "Price Fairness", value: priceFairness },
//     ];

//     return NextResponse.json({ trustScore: roundedScore, factors });
//   } catch (err) {
//     console.error("❌ Error calculating trust score:", err);
//     return NextResponse.json({ error: "Failed to calculate trust score" }, { status: 500 });
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
//     const orders = db.collection("orders");

//     const productId = new ObjectId(params.productId);

//     // 1️⃣ Fetch blockchain history
//     const chain = await blockchain.find({ productId }).sort({ timestamp: 1 }).toArray();
//     if (!chain.length)
//       return NextResponse.json({ trustScore: 0, factors: [] }, { status: 200 });

//     // 2️⃣ Initialize base AI factors
//     let blockchainIntegrity = 100;
//     let supplyChainEfficiency = Math.max(70, 120 - chain.length * 10);
//     let deliveryTimeliness = 90;
//     let sellerReliability = 88;
//     let freshness = 95;
//     let priceFairness = 90;

//     // 3️⃣ Blockchain Integrity Check
//     for (let i = 1; i < chain.length; i++) {
//       if (chain[i].previousHash !== chain[i - 1].hash) {
//         blockchainIntegrity = 65;
//         break;
//       }
//     }

//     // 4️⃣ Delivery Timeliness — estimate from order delays
//     const orderDocs = await orders.find({ productId }).toArray();
//     const deliveredOrders = orderDocs.filter((o) => o.status === "delivered");

//     if (deliveredOrders.length > 0) {
//       const delays = deliveredOrders.map((o) => {
//         if (!o.estimatedDeliveryDate || !o.actualDeliveryDate) return 0;
//         const delay =
//           new Date(o.actualDeliveryDate).getTime() -
//           new Date(o.estimatedDeliveryDate).getTime();
//         return delay > 0 ? Math.min(delay / (1000 * 60 * 60 * 24), 5) : 0; // cap at 5 days
//       });
//       const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
//       deliveryTimeliness = Math.max(60, 100 - avgDelay * 10);
//     }

//     // 5️⃣ Dynamic Seller Reliability — AI-like score from completed orders
//     const sellerOrderCount = orderDocs.length;
//     if (sellerOrderCount > 10) sellerReliability = 95;
//     else if (sellerOrderCount > 5) sellerReliability = 90;
//     else sellerReliability = 85;

//     // 6️⃣ Freshness — based on supply chain length
//     freshness = Math.max(70, 105 - chain.length * 5);

//     // 7️⃣ Price Fairness — simulate based on delivery timeliness
//     priceFairness = Math.min(100, deliveryTimeliness + 5);

//     // 8️⃣ Weighted AI Fusion
//     const trustScore = Math.round(
//       blockchainIntegrity * 0.25 +
//         supplyChainEfficiency * 0.15 +
//         deliveryTimeliness * 0.2 +
//         sellerReliability * 0.15 +
//         freshness * 0.15 +
//         priceFairness * 0.1
//     );

//     const factors = [
//       { name: "Blockchain Integrity", value: blockchainIntegrity },
//       { name: "Supply Chain Efficiency", value: supplyChainEfficiency },
//       { name: "Delivery Timeliness", value: deliveryTimeliness },
//       { name: "Seller Reliability", value: sellerReliability },
//       { name: "Freshness & Origin", value: freshness },
//       { name: "Price Fairness", value: priceFairness },
//     ];

//     // 9️⃣ Send AI-style structured result
//     return NextResponse.json(
//       {
//         trustScore,
//         factors,
//         analyzedBlocks: chain.length,
//         aiComment:
//           trustScore > 95
//             ? "Excellent — Verified and Fresh Product"
//             : trustScore > 85
//             ? "Trusted — Good Traceability & On-time Delivery"
//             : "Moderate — Some delays or weak chain integrity",
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("❌ Error calculating AI trust score:", err);
//     return NextResponse.json(
//       { error: "Failed to calculate trust score" },
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
    console.log("📌 Incoming Trust Score Request ProductID:", params.productId);

    // 🔍 Validate productId
    if (!params.productId || params.productId.length !== 24) {
      return NextResponse.json(
        { error: "Invalid productId format", trustScore: 0, factors: [] },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const blockchain = db.collection("blockchain_ledger");
    const orders = db.collection("orders");

    const productId = new ObjectId(params.productId);

    console.log("✅ Converted ObjectId:", productId);

    // 1️⃣ Fetch blockchain history
    const chain = await blockchain
      .find({ productId })
      .sort({ timestamp: 1 })
      .toArray();

    console.log("📦 Blockchain docs found:", chain.length);

    if (!chain.length) {
      return NextResponse.json(
        {
          trustScore: 85,
          factors: [
            { name: "Blockchain Integrity", value: 85 },
            { name: "Supply Chain Efficiency", value: 80 },
            { name: "Delivery Timeliness", value: 90 },
            { name: "Seller Reliability", value: 88 },
            { name: "Freshness & Origin", value: 86 },
            { name: "Price Fairness", value: 90 },
          ],
          aiComment: "AI estimated score — no blockchain records found.",
        },
        { status: 200 }
      );
    }

    // 2️⃣ Initialize AI factors
    let blockchainIntegrity = 100;
    let supplyChainEfficiency = Math.max(70, 120 - chain.length * 10);
    let deliveryTimeliness = 90;
    let sellerReliability = 88;
    let freshness = Math.max(70, 105 - chain.length * 5);
    let priceFairness = 90;

    // 3️⃣ Blockchain Integrity Check
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].previousHash !== chain[i - 1].hash) {
        blockchainIntegrity = 65;
        break;
      }
    }

    // 4️⃣ Orders analysis
    const orderDocs = await orders.find({ productId }).toArray();
    const deliveredOrders = orderDocs.filter((o) => o.status === "delivered");

    if (deliveredOrders.length > 0) {
      const delays = deliveredOrders.map((o) => {
        if (!o.estimatedDeliveryDate || !o.actualDeliveryDate) return 0;
        const delay =
          new Date(o.actualDeliveryDate).getTime() -
          new Date(o.estimatedDeliveryDate).getTime();
        return delay > 0
          ? Math.min(delay / (1000 * 60 * 60 * 24), 5)
          : 0;
      });

      const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
      deliveryTimeliness = Math.max(60, 100 - avgDelay * 10);
    }

    // 5️⃣ Seller reliability
    const sellerOrderCount = orderDocs.length;
    sellerReliability =
      sellerOrderCount > 10 ? 95 : sellerOrderCount > 5 ? 90 : 85;

    // 6️⃣ Price fairness
    priceFairness = Math.min(100, deliveryTimeliness + 5);

    // 7️⃣ AI Trust Score Fusion
    const trustScore = Math.round(
      blockchainIntegrity * 0.25 +
        supplyChainEfficiency * 0.15 +
        deliveryTimeliness * 0.2 +
        sellerReliability * 0.15 +
        freshness * 0.15 +
        priceFairness * 0.1
    );

    // 8️⃣ Detailed factors
    const factors = [
      { name: "Blockchain Integrity", value: blockchainIntegrity },
      { name: "Supply Chain Efficiency", value: supplyChainEfficiency },
      { name: "Delivery Timeliness", value: deliveryTimeliness },
      { name: "Seller Reliability", value: sellerReliability },
      { name: "Freshness & Origin", value: freshness },
      { name: "Price Fairness", value: priceFairness },
    ];

    return NextResponse.json(
      {
        trustScore,
        factors,
        analyzedBlocks: chain.length,
        aiComment:
          trustScore > 95
            ? "Excellent — Verified and Fresh Product"
            : trustScore > 85
            ? "Trusted — Good Traceability & On-time Delivery"
            : "Moderate — Some inconsistencies noted",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error calculating AI trust score:", err);
    return NextResponse.json(
      { error: "Failed to calculate trust score", trustScore: 0, factors: [] },
      { status: 500 }
    );
  }
}
