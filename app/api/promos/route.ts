import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const promos = await prisma.promo.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(promos);
}