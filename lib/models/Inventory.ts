import { ObjectId } from "mongodb"

export interface InventoryItem {
  _id?: ObjectId
  productId: ObjectId
  productName: string
  supplierId: ObjectId
  supplierName: string
  batchNumber: string
  quantity: number
  unit: string
  pricePerUnit?: number
  location: string
  // ✅ Added "pending" to the union type
  status: "available" | "reserved" | "sold" | "expired" | "pending"
  ownerId: ObjectId
  ownerName: string
  createdAt: Date
  updatedAt: Date
}
