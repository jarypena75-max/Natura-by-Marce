"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import FiltersBar from "@/components/FiltersBar";

type Settings = {
  catalogHeroImageUrl: string;
  catalogHeroTitle: string;
  catalogHeroSubtitle: string;
};

export default function CatalogoPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(false);

  // ✅ Portada desde BD (Admin la cambia). Con fallback por si falla.
  const [settings, setSettings] = useState<Settings>({
    catalogHeroImageUrl: "",
    catalogHeroTitle: "Catálogo Natura by Marce",
    catalogHeroSubtitle: "Elige, revisa disponibilidad y pide por WhatsApp.",
  });

  // ✅ Cargar portada (NO revienta aunque /api/settings falle)
  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then((s) => {
        if (!s) return;
        setSettings({
          catalogHeroImageUrl: s.catalogHeroImageUrl ?? "",
          catalogHeroTitle: s.catalogHeroTitle ?? "Catálogo Natura by Marce",
          catalogHeroSubtitle:
            s.catalogHeroSubtitle ?? "Elige, revisa disponibilidad y pide por WhatsApp.",
        });
      })
      .catch(() => {});
  }, []);

  // ✅ Cargar productos (con guardas para evitar errores)
  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (inStock) params.set("inStock", "1");

    fetch(`/api/products?${params.toString()}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) return [];
        return r.json().catch(() => []);
      })
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [q, category, inStock]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  return (
    <main className="mx-auto max-w-6xl p-4">
      {/* ✅ Banner / Portada (Admin la configura) */}
      <section className="rounded-3xl border overflow-hidden">
        <div className="relative aspect-[16/6] bg-gray-100">
          {settings.catalogHeroImageUrl ? (
            <img
              src={settings.catalogHeroImageUrl}
              alt="Portada catálogo"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

          <div className="absolute left-6 bottom-6 text-white">
            <div className="text-4xl font-bold leading-tight">{settings.catalogHeroTitle}</div>
            <div className="mt-1 opacity-90">{settings.catalogHeroSubtitle}</div>
          </div>
        </div>
      </section>

      <header className="pt-6 pb-3">
        <div className="text-2xl font-bold">Catálogo</div>
        <div className="text-sm opacity-70">Busca por categoría y pide por WhatsApp.</div>
      </header>

      <FiltersBar
        q={q}
        setQ={setQ}
        category={category}
        setCategory={setCategory}
        inStock={inStock}
        setInStock={setInStock}
        categories={categories}
      />

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </section>
    </main>
  );
}
