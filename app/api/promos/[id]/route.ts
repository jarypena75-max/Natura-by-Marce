import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { prisma } = await import("@/lib/prisma");

  const promo = await prisma.promo.findFirst({
    where: { id: params.id, isActive: true },
  });

  if (!promo) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  return NextResponse.json(promo);
}