import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const promo = await prisma.promo.findFirst({
    where: { id: params.id, isActive: true },
  });

  if (!promo) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(promo);
}