"use server";

import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { TraceabilityRecord } from "@/lib/models/TraceabilityRecord";

// Add record
export async function addTraceabilityRecord(
  data: Omit<TraceabilityRecord, "_id" | "createdAt" | "timestamp">
) {
  const db = await getDatabase();
  const collection = db.collection<TraceabilityRecord>("traceability");

  const record: TraceabilityRecord = {
    ...data,
    timestamp: new Date(),
    createdAt: new Date(),
    verificationStatus: data.verificationStatus || "pending",
  };

  const result = await collection.insertOne(record);
  return { ...record, _id: result.insertedId };
}

// Get product journey
export async function getProductJourney(productId: string) {
  const db = await getDatabase();
  const collection = db.collection<TraceabilityRecord>("traceability");

  return await collection
    .find({ productId: new ObjectId(productId) })
    .sort({ timestamp: -1 })
    .toArray();
}
