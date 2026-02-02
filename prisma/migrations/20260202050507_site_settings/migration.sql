-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "catalogHeroImageUrl" TEXT,
    "catalogHeroTitle" TEXT NOT NULL DEFAULT 'Catálogo Natura by Marce',
    "catalogHeroSubtitle" TEXT NOT NULL DEFAULT 'Elige, revisa disponibilidad y pide por WhatsApp.',
    "updatedAt" DATETIME NOT NULL
);
