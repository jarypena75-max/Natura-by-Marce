import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { prisma } = await import("@/lib/prisma");

  const url = new URL(req.url);
  const onlyActive = url.searchParams.get("all") !== "1";

  const promos = await prisma.promo.findMany({
    where: onlyActive ? { isActive: true } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(promos);
}