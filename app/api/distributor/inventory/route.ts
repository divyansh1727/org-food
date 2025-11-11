import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

/**
 * ======================================
 * GET → Fetch Distributor Inventory (available items)
 * ======================================
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "distributor") {
      return NextResponse.json(
        { error: "Access denied: Only distributors can view this inventory." },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const inventory = db.collection("distributor_inventory");

    // ✅ Show only "available" products belonging to the distributor
    const items = await inventory
      .find({
        ownerId: new ObjectId(user._id),
        status: "available",
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ inventory: items }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/distributor/inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
