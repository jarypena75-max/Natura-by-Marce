"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Promo = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
};

function waLink(text: string) {
  const num = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const base = num ? `https://wa.me/${num}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    fetch(`/api/promos?t=${Date.now()}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || "No se pudo cargar /api/promos");
        }
        return r.json();
      })
      .then((data) => setPromos(Array.isArray(data) ? data : []))
      .catch((e) => {
        setPromos([]);
        setError(String(e?.message || "Error cargando promos"));
      });
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="pb-4">
        <h1 className="text-2xl font-bold">Promociones</h1>
        <p className="mt-1 opacity-80">Combos, descuentos del mes o productos destacados.</p>
        <div className="mt-3">
          <Link href="/catalogo" className="underline">
            Ir al catálogo
          </Link>
        </div>
      </header>

      {error ? (
        <div className="mb-4 rounded-2xl border p-3 text-sm text-red-600">
          Error: {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {promos.map((p) => (
          <div key={p.id} className="rounded-3xl border overflow-hidden">
            <Link href={`/promos/${p.id}`} className="block">
              <div className="aspect-[16/10] bg-gray-100">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/promos/${p.id}`} className="font-semibold hover:underline">
                {p.title}
              </Link>

              <div className="mt-1 text-sm opacity-80 line-clamp-2 whitespace-pre-line">
                {p.description}
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/promos/${p.id}`}
                  className="inline-flex rounded-2xl border px-4 py-2 text-sm font-semibold"
                >
                  Ver promo
                </Link>

                <a
                  className="inline-flex rounded-2xl border px-4 py-2 text-sm font-semibold"
                  href={waLink(`Hola Marce, me interesa la promo: ${p.title}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}

        {!error && !promos.length ? (
          <div className="opacity-70">Aún no hay promociones publicadas.</div>
        ) : null}
      </section>
    </main>
  );
}
