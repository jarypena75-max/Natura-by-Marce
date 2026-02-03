import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log("Seed skipped: already have products.");
    return;
  }

  await prisma.product.createMany({
    data: [
      {
        slug: "crema-corporal-hidratante",
        name: "Crema corporal hidratante",
        category: "Cuerpo",
        description: "Hidratación diaria con sensación ligera.",
        benefits: `• Suaviza
• Hidrata
• Aroma agradable`,
        howToUse: "Aplicar sobre piel limpia, masajeando hasta absorber.",
        size: "200 ml",
        price: 19900,
        stock: 5,
        minStock: 3,
        isActive: true,
        imageUrl: null,
      },
      {
        slug: "shampoo-nutritivo",
        name: "Shampoo nutritivo",
        category: "Cabello",
        description: "Limpieza suave para uso diario.",
        benefits: `• Brillo
• Suavidad
• Nutrición`,
        howToUse: "Aplicar, masajear y enjuagar. Repetir si es necesario.",
        size: "300 ml",
        price: 17900,
        stock: 2,
        minStock: 3,
        isActive: true,
        imageUrl: null,
      },
      {
        slug: "perfume-fresco",
        name: "Fragancia fresca",
        category: "Fragancias",
        description: "Aroma fresco para el día a día.",
        benefits: `• Larga duración
• Ideal diario`,
        howToUse: "Rociar a 15 cm en puntos de pulso.",
        size: "100 ml",
        price: 49900,
        stock: 0,
        minStock: 2,
        isActive: true,
        imageUrl: null,
      },
    ],
  });

  console.log("Seed completed: added sample products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });