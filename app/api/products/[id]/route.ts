// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import type { Product } from "@/lib/models/Product";
// import { ObjectId } from "mongodb";
// import { verifyAuth } from "@/lib/auth";

// /* =========================================
//    PATCH → Update product (Farmer only)
// ========================================= */
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const authResult = await verifyAuth(request);
//     if (!authResult.success) {
//       return NextResponse.json({ error: authResult.error }, { status: 401 });
//     }
//     const user = authResult.user!;
//     if (user.role !== "farmer") {
//       return NextResponse.json({ error: "Only farmers can update products" }, { status: 403 });
//     }

//     const productId = params.id;
//     if (!ObjectId.isValid(productId)) {
//       return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
//     }

//     const body = await request.json();
//     const allowed: (keyof Product)[] = [
//       "name",
//       "description",
//       "category",
//       "quantity",
//       "unit",
//       "pricePerUnit",
//       "harvestDate",
//       "expiryDate",
//       "certifications",
//       "images",
//       "location",
//       "traceabilityData",
//       "status",
//     ];

//     const update: Partial<Product> = {};
//     for (const key of allowed) {
//       if (key in body) {
//         if (key === "harvestDate" || key === "expiryDate") {
//           (update as any)[key] = body[key] ? new Date(body[key]) : undefined;
//         } else if (key === "quantity" || key === "pricePerUnit") {
//           (update as any)[key] = Number(body[key]);
//         } else {
//           (update as any)[key] = body[key];
//         }
//       }
//     }

//     // ✅ Keep ownership consistent
//     update.ownerId = new ObjectId(user._id as any);
//     update.ownerName = user.name;
//     update.updatedAt = new Date();

//     const db = await getDatabase();
//     const products = db.collection<Product>("products");

//     const res = await products.updateOne(
//       { _id: new ObjectId(productId), farmerId: new ObjectId(user._id as any) },
//       { $set: update }
//     );

//     if (res.matchedCount === 0) {
//       return NextResponse.json({ error: "Product not found or not owned by you" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Product updated successfully" });
//   } catch (error) {
//     console.error("Update product error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// /* =========================================
//    DELETE → Remove product (Farmer only)
// ========================================= */
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const authResult = await verifyAuth(request);
//     if (!authResult.success) {
//       return NextResponse.json({ error: authResult.error }, { status: 401 });
//     }
//     const user = authResult.user!;
//     if (user.role !== "farmer") {
//       return NextResponse.json({ error: "Only farmers can delete products" }, { status: 403 });
//     }

//     const productId = params.id;
//     if (!ObjectId.isValid(productId)) {
//       return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
//     }

//     const db = await getDatabase();
//     const products = db.collection<Product>("products");

//     const res = await products.deleteOne({
//       _id: new ObjectId(productId),
//       farmerId: new ObjectId(user._id as any),
//     });

//     if (res.deletedCount === 0) {
//       return NextResponse.json({ error: "Product not found or not owned by you" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Product } from "@/lib/models/Product";
import { ObjectId } from "mongodb";
import { verifyAuth } from "@/lib/auth";

/* =========================================
   PATCH → Update product (Farmer only)
========================================= */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "farmer") {
      return NextResponse.json(
        { error: "Only farmers can update products" },
        { status: 403 }
      );
    }

    const productId = params.id;
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const products = db.collection<Product>("products");

    const body = await request.json();

    const allowedFields: (keyof Product)[] = [
      "name",
      "description",
      "category",
      "quantity",
      "unit",
      "pricePerUnit",
      "harvestDate",
      "expiryDate",
      "certifications",
      "images",
      "location",
      "traceabilityData",
      "status",
    ];

    const updateData: Partial<Product> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "quantity" || field === "pricePerUnit") {
          (updateData as any)[field] = Number(body[field]);
        } else if (field === "harvestDate" || field === "expiryDate") {
          (updateData as any)[field] = body[field]
            ? new Date(body[field])
            : undefined;
        } else {
          (updateData as any)[field] = body[field];
        }
      }
    }

    // ✅ Keep ownership consistent
    updateData.ownerId = new ObjectId(user._id);
    updateData.ownerName = user.name;
    updateData.updatedAt = new Date();

    const result = await products.updateOne(
      { _id: new ObjectId(productId), ownerId: new ObjectId(user._id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Product not found or not owned by this farmer" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "✅ Product updated successfully" });
  } catch (error) {
    console.error("❌ PATCH /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =========================================
   DELETE → Remove product (Farmer only)
========================================= */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = auth.user!;
    if (user.role.toLowerCase() !== "farmer") {
      return NextResponse.json(
        { error: "Only farmers can delete products" },
        { status: 403 }
      );
    }

    const productId = params.id;
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const products = db.collection<Product>("products");

    const result = await products.deleteOne({
      _id: new ObjectId(productId),
      ownerId: new ObjectId(user._id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Product not found or not owned by this farmer" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
