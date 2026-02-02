"use client";

import { useEffect, useState } from "react";

type Promo = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

const empty: Promo = {
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [form, setForm] = useState<Promo>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/promos?all=1", { cache: "no-store" });
    const data = await res.json().catch(() => []);
    setPromos(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditingId(null);
    setForm({ ...empty });
  }

  function startEdit(p: Promo) {
    setEditingId(p.id);
    setForm({
      ...p,
      imageUrl: p.imageUrl ?? "",
      startsAt: p.startsAt ? p.startsAt.slice(0, 16) : "",
      endsAt: p.endsAt ? p.endsAt.slice(0, 16) : "",
    });
  }

  function onPickImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: String(reader.result || "") }));
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!form.title.trim()) return alert("Falta: Título");

    setSaving(true);
    try {
      const payload = {
        ...form,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      };

      const res = await fetch(editingId ? `/api/promos/${editingId}` : "/api/promos", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) return alert(j.error || "Error guardando (¿logueado como admin?)");

      await load();
      startNew();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar promo?")) return;
    const res = await fetch(`/api/promos/${id}`, { method: "DELETE" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return alert(j.error || "Error eliminando");
    await load();
    if (editingId === id) startNew();
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="flex items-center justify-between py-4">
        <div>
          <div className="text-2xl font-bold">Promociones (Admin)</div>
          <div className="text-sm opacity-70">Crea/edita promos y elimínalas cuando ya no apliquen.</div>
        </div>
        <div className="flex gap-2">
          <a className="rounded-2xl border px-4 py-2" href="/admin/productos">
            Inventario
          </a>
          <a className="rounded-2xl border px-4 py-2" href="/promos">
            Ver Promos
          </a>
          <button className="rounded-2xl border px-4 py-2" onClick={startNew}>
            + Nueva promo
          </button>
        </div>
      </header>

      <section className="rounded-3xl border p-5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{editingId ? "Editar promo" : "Nueva promo"}</div>
          {editingId ? (
            <button className="text-sm underline opacity-80" onClick={startNew}>
              cancelar
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Título *</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Descripción</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Inicio (opcional)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              type="datetime-local"
              value={form.startsAt || ""}
              onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Fin (opcional)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              type="datetime-local"
              value={form.endsAt || ""}
              onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2 grid gap-3 md:grid-cols-2 items-start">
            <div>
              <label className="text-sm opacity-70">Imagen (archivo)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onPickImage(file);
                }}
              />

              <label className="mt-4 block text-sm opacity-70">O pegar URL</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={form.imageUrl || ""}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="rounded-2xl border p-3">
              <div className="text-sm font-semibold">Vista previa</div>
              <div className="mt-2 aspect-[16/9] w-full rounded-xl bg-gray-100 overflow-hidden">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-xs opacity-60">Sin imagen</div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between mt-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Visible en Promos
            </label>

            <button className="rounded-2xl border px-5 py-2 font-semibold" onClick={save} disabled={saving}>
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear promo"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Promo</th>
              <th className="p-3">Visible</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs opacity-60">{p.description}</div>
                </td>
                <td className="p-3">{p.isActive ? "Sí" : "No"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="rounded-xl border px-3 py-1" onClick={() => startEdit(p)}>
                      Editar
                    </button>
                    <button className="rounded-xl border px-3 py-1" onClick={() => remove(p.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}