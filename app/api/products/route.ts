import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const onlyInStock = url.searchParams.get("inStock") === "1";

  // Si viene all=1 y es admin, mostramos todo (incluye inactivos)
  const wantsAll = url.searchParams.get("all") === "1";
  const admin = wantsAll ? await isAdminRequest() : false;

  const products = await prisma.product.findMany({
    where: {
      ...(admin ? {} : { isActive: true }),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { benefits: { contains: q, mode: "insensitive" } },
              { howToUse: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category ? { category } : {}),
      ...(onlyInStock ? { stock: { gt: 0 } } : {}),
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();

  const created = await prisma.product.create({
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
      isActive: body.isActive ?? true,
      imageUrl: body.imageUrl ?? null, // aquí guardamos URL o Base64
    },
  });

  return NextResponse.json(created);
}
