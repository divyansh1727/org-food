import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth } from "@/lib/auth";

// ✅ PATCH → Retailer updates product price in their inventory
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (auth.user.role.toLowerCase() !== "retailer")
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const productId = params.id;
    if (!ObjectId.isValid(productId))
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

    const { pricePerUnit } = await request.json();
    if (!pricePerUnit || pricePerUnit <= 0)
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });

    const db = await getDatabase();
    const retailerInventory = db.collection("retailer_inventory");

    // ✅ Update the retailer’s inventory price
    await retailerInventory.updateOne(
      { _id: new ObjectId(productId), ownerId: new ObjectId(auth.user._id) },
      {
        $set: {
          pricePerUnit: Number(pricePerUnit),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "✅ Price updated successfully" });
  } catch (error) {
    console.error("PATCH /api/retailer/inventory/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
