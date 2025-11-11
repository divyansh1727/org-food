// import { type NextRequest, NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
// import type { InventoryItem } from "@/lib/models/Inventory"
// import { ObjectId } from "mongodb"

// export async function GET(request: NextRequest) {
//   try {
//     const { db } = await connectToDatabase()
//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get("status")
//     const supplierId = searchParams.get("supplierId")

//     const filter: any = {}
//     if (status) filter.status = status
//     if (supplierId) filter.supplierId = new ObjectId(supplierId)

//     const inventory = await db.collection<InventoryItem>("inventory").find(filter).sort({ createdAt: -1 }).toArray()

//     return NextResponse.json(inventory)
//   } catch (error) {
//     console.error("Error fetching inventory:", error)
//     return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { db } = await connectToDatabase()
//     const inventoryData = await request.json()

//     const newItem: InventoryItem = {
//       ...inventoryData,
//       productId: new ObjectId(inventoryData.productId),
//       supplierId: new ObjectId(inventoryData.supplierId),
//       status: "available",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }

//     const result = await db.collection<InventoryItem>("inventory").insertOne(newItem)

//     return NextResponse.json(
//       {
//         ...newItem,
//         _id: result.insertedId,
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     console.error("Error creating inventory item:", error)
//     return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 })
//   }
// }
// import { type NextRequest, NextResponse } from "next/server"
// import { getDatabase } from "@/lib/mongodb"
// import { verifyAuth } from "@/lib/auth"
// import { ObjectId } from "mongodb"
// import type { InventoryItem } from "@/lib/models/Inventory"

// /**
//  * ======================================
//  * GET → Fetch Distributor Inventory
//  * ======================================
//  */
// export async function GET(request: NextRequest) {
//   try {
//     // ✅ 1. Verify authentication
//     const auth = await verifyAuth(request)
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 })

//     const user = auth.user!
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can view this inventory." },
//         { status: 403 }
//       )
//     }

//     // ✅ 2. Connect to database
//     const db = await getDatabase()
//     const inventory = db.collection("distributor_inventory")

//     // ✅ 3. Build query (support for pending + available)
//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get("status")

//     const query: Record<string, any> = {
//       ownerId: new ObjectId(user._id),
//     }

//     if (status === "all") {
//       query.status = { $in: ["available", "pending"] }
//     } else if (status) {
//       query.status = status
//     } else {
//       query.status = { $in: ["available", "pending"] } // default
//     }

//     // ✅ 4. Fetch items
//     const items = await inventory.find(query).sort({ createdAt: -1 }).toArray()

//     return NextResponse.json({ inventory: items }, { status: 200 })
//   } catch (error) {
//     console.error("❌ GET /api/distributor/inventory error:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

// /**
//  * ======================================
//  * POST → Add New Distributor Inventory Item
//  * ======================================
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const auth = await verifyAuth(request)
//     if (!auth.success)
//       return NextResponse.json({ error: auth.error }, { status: 401 })

//     const user = auth.user!
//     if (user.role.toLowerCase() !== "distributor") {
//       return NextResponse.json(
//         { error: "Access denied: Only distributors can add inventory." },
//         { status: 403 }
//       )
//     }

//     const db = await getDatabase()
//     const distributorInventory = db.collection("distributor_inventory")

//     const data = await request.json()
//     const {
//       productId,
//       productName,
//       supplierId,
//       supplierName,
//       batchNumber,
//       quantity,
//       unit,
//       pricePerUnit,
//       location,
//     } = data

//     if (!productId || !productName || !supplierId || !supplierName || !quantity) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       )
//     }

//     const newItem: InventoryItem = {
//       productId: new ObjectId(productId),
//       productName,
//       supplierId: new ObjectId(supplierId),
//       supplierName,
//       batchNumber: batchNumber || `BATCH-${Date.now()}`,
//       quantity: Number(quantity),
//       unit: unit || "unit",
//       pricePerUnit: Number(pricePerUnit) || 0,
//       location: location || "Distributor warehouse",
//       status: "pending", // ⬅️ Default to pending until shipped
//       ownerId: new ObjectId(user._id),
//       ownerName: user.name,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }

//     const result = await distributorInventory.insertOne(newItem)

//     return NextResponse.json(
//       {
//         message: "Item added to distributor inventory successfully",
//         inventory: { ...newItem, _id: result.insertedId },
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("❌ POST /api/distributor/inventory error:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyAuth } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { InventoryItem } from "@/lib/models/Inventory"

/**
 * ======================================
 * GET → Fetch Distributor Inventory
 * ======================================
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ 1. Verify authentication
    const auth = await verifyAuth(request)
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 })

    const user = auth.user!
    if (user.role.toLowerCase() !== "distributor") {
      return NextResponse.json(
        { error: "Access denied: Only distributors can view this inventory." },
        { status: 403 }
      )
    }

    // ✅ 2. Connect to database
    const db = await getDatabase()
    const inventory = db.collection("distributor_inventory")

    // ✅ 3. Build query (support available + pending + both ObjectId types)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const query: Record<string, any> = {
      $or: [
        { ownerId: new ObjectId(user._id) },
        { ownerId: String(user._id) },
      ],
    }

    if (status === "all") {
      query.status = { $in: ["available", "pending"] }
    } else if (status) {
      query.status = status
    } else {
      query.status = { $in: ["available", "pending"] } // default
    }

    console.log("🧩 Distributor inventory query:", query)

    // ✅ 4. Fetch items
    const items = await inventory.find(query).sort({ createdAt: -1 }).toArray()

    console.log(`📦 Found ${items.length} items for distributor ${user.name}`)

    return NextResponse.json({ inventory: items }, { status: 200 })
  } catch (error) {
    console.error("❌ GET /api/distributor/inventory error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * ======================================
 * POST → Add New Distributor Inventory Item
 * ======================================
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 })

    const user = auth.user!
    if (user.role.toLowerCase() !== "distributor") {
      return NextResponse.json(
        { error: "Access denied: Only distributors can add inventory." },
        { status: 403 }
      )
    }

    const db = await getDatabase()
    const distributorInventory = db.collection("distributor_inventory")

    const data = await request.json()
    const {
      productId,
      productName,
      supplierId,
      supplierName,
      batchNumber,
      quantity,
      unit,
      pricePerUnit,
      location,
    } = data

    if (!productId || !productName || !supplierId || !supplierName || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      )
    }

    const newItem: InventoryItem = {
      productId: new ObjectId(productId),
      productName,
      supplierId: new ObjectId(supplierId),
      supplierName,
      batchNumber: batchNumber || `BATCH-${Date.now()}`,
      quantity: Number(quantity),
      unit: unit || "unit",
      pricePerUnit: Number(pricePerUnit) || 0,
      location: location || "Distributor warehouse",
      status: "pending", // ⬅️ Default to pending until shipped
      ownerId: new ObjectId(user._id),
      ownerName: user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await distributorInventory.insertOne(newItem)

    return NextResponse.json(
      {
        message: "Item added to distributor inventory successfully",
        inventory: { ...newItem, _id: result.insertedId },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ POST /api/distributor/inventory error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
