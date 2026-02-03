import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

// ✅ para evitar que Next intente "precalcular" cosas raras en build
export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = params.id;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = params.id;
  const body = await req.json().catch(() => ({}));

  const updated = await prisma.product.update({
    where: { id },
    data: {
      slug: body.slug,
      name: body.name,
      brand: body.brand ?? "Natura",
      category: body.category,
      description: body.description ?? "",
      benefits: body.benefits ?? "",
      howToUse: body.howToUse ?? "",
      size: body.size ?? "",
      price: Number(body.price ?? 0),
      stock: Number(body.stock ?? 0),
      minStock: Number(body.minStock ?? 3),
      isActive: Boolean(body.isActive),
      imageUrl: body.imageUrl ?? null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = params.id;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}