import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  try {
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(body.slug !== undefined ? { slug: String(body.slug) } : {}),
        ...(body.name !== undefined ? { name: String(body.name) } : {}),
        ...(body.brand !== undefined ? { brand: String(body.brand) } : {}),
        ...(body.category !== undefined ? { category: String(body.category) } : {}),
        ...(body.description !== undefined ? { description: String(body.description) } : {}),
        ...(body.benefits !== undefined ? { benefits: String(body.benefits) } : {}),
        ...(body.howToUse !== undefined ? { howToUse: String(body.howToUse) } : {}),
        ...(body.size !== undefined ? { size: String(body.size) } : {}),
        ...(body.price !== undefined ? { price: Number(body.price) } : {}),
        ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
        ...(body.minStock !== undefined ? { minStock: Number(body.minStock) } : {}),
        ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl ?? null } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al actualizar" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
