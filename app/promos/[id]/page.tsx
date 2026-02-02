"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Promo = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
};

function fmtDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

function waLink(text: string) {
  const num = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const base = num ? `https://wa.me/${num}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export default function PromoDetallePage({ params }: { params: { id: string } }) {
  const [promo, setPromo] = useState<Promo | null>(null);

  useEffect(() => {
    fetch(`/api/promos/${params.id}?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPromo(data && data.id ? data : null))
      .catch(() => setPromo(null));
  }, [params.id]);

  if (!promo) {
    return (
      <main className="mx-auto max-w-3xl p-4">
        <Link href="/promos" className="underline">
          ← Volver a Promos
        </Link>
        <div className="mt-6 rounded-3xl border p-6">
          <div className="text-xl font-bold">Promo no encontrada</div>
          <div className="mt-2 opacity-70">Puede que esté desactivada o eliminada.</div>
        </div>
      </main>
    );
  }

  const starts = fmtDate(promo.startsAt);
  const ends = fmtDate(promo.endsAt);

  return (
    <main className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between">
        <Link href="/promos" className="underline">
          ← Volver a Promos
        </Link>
        <Link href="/catalogo" className="underline">
          Ir al catálogo →
        </Link>
      </div>

      <section className="mt-4 rounded-3xl border overflow-hidden">
        <div className="aspect-[16/8] bg-gray-100">
          {promo.imageUrl ? (
            <img src={promo.imageUrl} alt={promo.title} className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold">{promo.title}</h1>

          {(starts || ends) ? (
            <div className="mt-2 text-sm opacity-70">
              {starts ? <span>Inicio: {starts}</span> : null}
              {starts && ends ? <span className="mx-2">•</span> : null}
              {ends ? <span>Fin: {ends}</span> : null}
            </div>
          ) : null}

          <div className="mt-4 whitespace-pre-line opacity-90">{promo.description}</div>

          <div className="mt-6">
            <a
              className="inline-flex rounded-2xl border px-5 py-2 font-semibold"
              href={waLink(`Hola Marce, me interesa la promo: ${promo.title}`)}
              target="_blank"
              rel="noreferrer"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}