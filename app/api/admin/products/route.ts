import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  if (!body.slug || !body.name || !body.category) {
    return NextResponse.json({ error: "Faltan campos: slug, name, category" }, { status: 400 });
  }

  try {
    const created = await prisma.product.create({
      data: {
        slug: String(body.slug),
        name: String(body.name),
        brand: String(body.brand || "Natura"),
        category: String(body.category),
        description: String(body.description || ""),
        benefits: String(body.benefits || ""),
        howToUse: String(body.howToUse || ""),
        size: String(body.size || ""),
        price: Number(body.price || 0),
        stock: Number(body.stock || 0),
        minStock: Number(body.minStock || 3),
        isActive: body.isActive ?? true,
        imageUrl: body.imageUrl ?? null,
      },
    });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al crear" }, { status: 400 });
  }
}
