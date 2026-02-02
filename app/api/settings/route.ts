import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

async function getOrCreate() {
  const existing = await prisma.siteSetting.findUnique({ where: { id: "main" } });
  if (existing) return existing;
  return prisma.siteSetting.create({
    data: { id: "main" },
  });
}

// Público: el catálogo lo puede leer
export async function GET() {
  const s = await getOrCreate();
  return NextResponse.json({
    catalogHeroImageUrl: s.catalogHeroImageUrl,
    catalogHeroTitle: s.catalogHeroTitle,
    catalogHeroSubtitle: s.catalogHeroSubtitle,
  });
}

// Solo admin: guardar cambios
export async function PUT(req: Request) {
  const admin = await isAdminRequest();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const updated = await prisma.siteSetting.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      catalogHeroImageUrl: body.catalogHeroImageUrl ?? null,
      catalogHeroTitle: body.catalogHeroTitle ?? "Catálogo Natura by Marce",
      catalogHeroSubtitle: body.catalogHeroSubtitle ?? "Elige, revisa disponibilidad y pide por WhatsApp.",
    },
    update: {
      catalogHeroImageUrl: body.catalogHeroImageUrl ?? null,
      catalogHeroTitle: body.catalogHeroTitle ?? "Catálogo Natura by Marce",
      catalogHeroSubtitle: body.catalogHeroSubtitle ?? "Elige, revisa disponibilidad y pide por WhatsApp.",
    },
  });

  return NextResponse.json(updated);
}