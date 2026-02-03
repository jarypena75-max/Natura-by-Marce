export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await isAdminRequest();
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const movements = await prisma.movement.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { product: true },
    });

    return NextResponse.json(movements);
  } catch (e: any) {
    console.error("GET /api/movements error:", e);
    return NextResponse.json(
      { error: "Error leyendo movimientos", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await isAdminRequest();
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const productId = String(body.productId || "");
    const type = body.type as "IN" | "OUT" | "ADJUST";
    const qty = Number(body.qty || 0);
    const note = String(body.note || "");

    if (!productId || !type || !Number.isFinite(qty) || qty === 0) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Producto no existe" }, { status: 404 });

    const abs = Math.abs(qty);
    const newStock =
      type === "IN" ? product.stock + abs :
      type === "OUT" ? product.stock - abs :
      product.stock + qty;

    if (newStock < 0) {
      return NextResponse.json({ error: "Stock no puede quedar negativo" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const mov = await tx.movement.create({
        data: { productId, type, qty, note },
      });
      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });
      return { mov, updated };
    });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("POST /api/movements error:", e);
    return NextResponse.json(
      { error: "Error guardando movimiento", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}