import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

// ✅ Evita que Next intente “precalcular” esto en build (Vercel)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const onlyInStock = url.searchParams.get("inStock") === "1";

  const wantsAll = url.searchParams.get("all") === "1";

  // ✅ Solo intentamos auth si de verdad piden all=1, y con guardas
  let admin = false;
  if (wantsAll) {
    try {
      admin = await isAdminRequest();
    } catch {
      admin = false;
    }
  }

  const products = await prisma.product.findMany({
    where: {
      ...(admin ? {} : { isActive: true }),
      ...(q ? { name: { contains: q } } : {}),
      ...(category ? { category } : {}),
      ...(onlyInStock ? { stock: { gt: 0 } } : {}),
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  let admin = false;
  try {
    admin = await isAdminRequest();
  } catch {
    admin = false;
  }

  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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
      imageUrl: body.imageUrl ?? null,
    },
  });

  return NextResponse.json(created);
}