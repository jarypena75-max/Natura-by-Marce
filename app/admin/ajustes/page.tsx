"use client";

import { useEffect, useState } from "react";

type Settings = {
  catalogHeroImageUrl: string;
  catalogHeroTitle: string;
  catalogHeroSubtitle: string;
};

export default function AdminAjustesPage() {
  const [s, setS] = useState<Settings>({
    catalogHeroImageUrl: "",
    catalogHeroTitle: "Catálogo Natura by Marce",
    catalogHeroSubtitle: "Elige, revisa disponibilidad y pide por WhatsApp.",
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json().catch(() => null);
    if (!data) return;

    setS({
      catalogHeroImageUrl: data.catalogHeroImageUrl ?? "",
      catalogHeroTitle: data.catalogHeroTitle ?? "Catálogo Natura by Marce",
      catalogHeroSubtitle: data.catalogHeroSubtitle ?? "Elige, revisa disponibilidad y pide por WhatsApp.",
    });
  }

  useEffect(() => {
    load();
  }, []);

  function onPickImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setS((prev) => ({ ...prev, catalogHeroImageUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file); // ✅ Base64 (funciona en Vercel)
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(j.error || "Error guardando. Asegúrate de estar logueado como admin.");
        return;
      }

      alert("✅ Portada guardada");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="py-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Portada del catálogo</div>
          <div className="text-sm opacity-70">Marce cambia la imagen grande sin tocar código.</div>
        </div>
        <a className="rounded-2xl border px-4 py-2" href="/admin/productos">
          Volver a inventario
        </a>
      </header>

      <section className="rounded-3xl border p-5 grid gap-4 md:grid-cols-2 items-start">
        <div className="space-y-3">
          <div>
            <label className="text-sm opacity-70">Título</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={s.catalogHeroTitle}
              onChange={(e) => setS((p) => ({ ...p, catalogHeroTitle: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Subtítulo</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={s.catalogHeroSubtitle}
              onChange={(e) => setS((p) => ({ ...p, catalogHeroSubtitle: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Subir imagen (archivo)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPickImage(file);
              }}
            />
            <div className="mt-2 text-xs opacity-60">
              Tip: usa una imagen ligera (ideal &lt; 800KB).
            </div>
          </div>

          <div>
            <label className="text-sm opacity-70">O pegar URL de imagen</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={s.catalogHeroImageUrl}
              onChange={(e) => setS((p) => ({ ...p, catalogHeroImageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <button className="rounded-2xl border px-5 py-2 font-semibold" onClick={save} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>

        <div className="rounded-3xl border overflow-hidden">
          <div className="text-sm font-semibold p-3 border-b">Vista previa</div>
          <div className="relative aspect-[16/6] bg-gray-100">
            {s.catalogHeroImageUrl ? (
              <img
                src={s.catalogHeroImageUrl}
                alt="Portada"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
            <div className="absolute left-5 bottom-5 text-white">
              <div className="text-2xl font-bold">{s.catalogHeroTitle}</div>
              <div className="opacity-90">{s.catalogHeroSubtitle}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
