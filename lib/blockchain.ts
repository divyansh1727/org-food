// import crypto from "crypto";
// import { getDatabase } from "./mongodb";
// import { ObjectId } from "mongodb";

// export async function addBlock({
//   productId,
//   orderId,
//   actorId,
//   actorRole,
//   action,
//   data,
// }: {
//   productId: ObjectId;
//   orderId: ObjectId;
//   actorId: ObjectId;
//   actorRole: string;
//   action: string;
//   data?: any;
// }) {
//   const db = await getDatabase();
//   const blockchain = db.collection("blockchain_ledger");

//   // Find last block for this product
//   const lastBlock = await blockchain
//     .find({ productId })
//     .sort({ timestamp: -1 })
//     .limit(1)
//     .toArray();

//   const previousHash = lastBlock.length ? lastBlock[0].hash : "GENESIS";

//   const timestamp = new Date();
//   const blockData = {
//     productId,
//     orderId,
//     actorId,
//     actorRole,
//     action,
//     timestamp,
//     data: data || {},
//     previousHash,
//   };

//   // Generate hash
//   const hash = crypto
//     .createHash("sha256")
//     .update(JSON.stringify(blockData))
//     .digest("hex");

//   const newBlock = { ...blockData, hash };

//   await blockchain.insertOne(newBlock);
//   console.log(`✅ Added blockchain record for ${action} by ${actorRole}`);

//   return newBlock;
// }
import crypto from "crypto";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface BlockData {
  productId: string | ObjectId;
  orderId: string | ObjectId;
  actorId: string | ObjectId;
  actorRole: string;
  action: string;
  data?: Record<string, any>;
}

/**
 * 🔒 Hash generator using SHA-256
 */
function generateHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * 🧱 Add a new block to the blockchain ledger
 */
export async function addBlock({
  productId,
  orderId,
  actorId,
  actorRole,
  action,
  data = {},
}: BlockData) {
  const db = await getDatabase();
  const blockchain = db.collection("blockchain_ledger");

  // Get last block for this product
  const lastBlock = await blockchain
    .find({ productId })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();

  const previousHash = lastBlock.length > 0 ? lastBlock[0].hash : "00000000";
  const timestamp = new Date();

  const blockContent = JSON.stringify({
    productId,
    orderId,
    actorId,
    actorRole,
    action,
    data,
    previousHash,
    timestamp,
  });

  const hash = generateHash(blockContent);

  const newBlock = {
    productId: new ObjectId(productId),
    orderId: new ObjectId(orderId),
    actorId: new ObjectId(actorId),
    actorRole,
    action,
    data,
    previousHash,
    hash,
    timestamp,
  };

  await blockchain.insertOne(newBlock);

  console.log(`✅ Block added for product ${productId}: ${action}`);
  return newBlock;
}

/**
 * ✅ Verify blockchain integrity for a given product
 */
export async function verifyBlockchain(productId: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const blockchain = db.collection("blockchain_ledger");

  const chain = await blockchain
    .find({ productId })
    .sort({ timestamp: 1 })
    .toArray();

  for (let i = 1; i < chain.length; i++) {
    const block = chain[i];
    const prev = chain[i - 1];

    // Recreate the expected hash
    const reconstructed = JSON.stringify({
      productId: block.productId,
      orderId: block.orderId,
      actorId: block.actorId,
      actorRole: block.actorRole,
      action: block.action,
      data: block.data,
      previousHash: block.previousHash,
      timestamp: block.timestamp,
    });

    const expectedHash = generateHash(reconstructed);

    if (block.previousHash !== prev.hash || block.hash !== expectedHash) {
      console.warn(`❌ Blockchain broken at block ${i} (${block.action})`);
      return false;
    }
  }

  console.log(`✅ Blockchain verified for product ${productId}`);
  return true;
}
