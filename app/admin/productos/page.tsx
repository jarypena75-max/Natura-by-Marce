"use client";

import { useEffect, useMemo, useState } from "react";

function money(cents: number) {
  return (cents / 100).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  benefits: string;
  howToUse: string;
  size: string;
  price: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  imageUrl?: string | null;
};

const empty: Product = {
  id: "",
  slug: "",
  name: "",
  brand: "Natura",
  category: "",
  description: "",
  benefits: "",
  howToUse: "",
  size: "",
  price: 0,
  stock: 0,
  minStock: 3,
  isActive: true,
  imageUrl: "",
};

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/products?all=1", { cache: "no-store" });
    const data = await res.json().catch(() => []);
    setProducts(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  function startNew() {
    setEditingId(null);
    setForm({ ...empty });
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({ ...p, imageUrl: p.imageUrl ?? "" });
  }

  function onPickImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!form.name.trim() || !form.category.trim()) {
      alert("Falta: Nombre y Categoría");
      return;
    }

    setSaving(true);
    try {
      const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.name);

      const payload = {
        ...form,
        slug,
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      };

      const res = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(j.error || "Error guardando (¿logueado como admin?)");
        return;
      }

      await load();
      startNew();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar producto?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(j.error || "Error eliminando");
      return;
    }
    await load();
    if (editingId === id) startNew();
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="flex items-center justify-between py-4">
        <div>
          <div className="text-2xl font-bold">Inventario (Admin)</div>
          <div className="text-sm opacity-70">
            Aquí puedes crear/editar todo: imagen, descripción, beneficios, modo de uso, etc.
          </div>
        </div>

        {/* ✅ BOTONES ADMIN */}
        <div className="flex gap-2">
          <a className="rounded-2xl border px-4 py-2" href="/admin/movimientos">
            Movimientos
          </a>

          {/* ✅ BOTÓN PROMOS */}
          <a className="rounded-2xl border px-4 py-2" href="/admin/promos">
            Promos (editar/eliminar)
          </a>

          {/* ✅ PORTADA (si existe tu página de ajustes) */}
          <a className="rounded-2xl border px-4 py-2" href="/admin/ajustes">
            Portada del catálogo
          </a>

          <button className="rounded-2xl border px-4 py-2" onClick={startNew}>
            + Nuevo producto
          </button>
        </div>
      </header>

      {/* FORM */}
      <section className="rounded-3xl border p-5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{editingId ? "Editar producto" : "Nuevo producto"}</div>
          {editingId ? (
            <button className="text-sm underline opacity-80" onClick={startNew}>
              cancelar edición
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm opacity-70">Nombre *</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Crema Hidratante Ekos"
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Categoría *</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              list="categories"
              placeholder="Ej. Cuerpo, Cabello, Fragancias..."
            />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="text-sm opacity-70">Marca</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Slug (URL)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="ej. crema-hidratante-ekos"
            />
            <div className="mt-1 text-xs opacity-60">Si lo dejas vacío, se genera automático del nombre.</div>
          </div>

          <div>
            <label className="text-sm opacity-70">Presentación (ml/gr)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              placeholder="Ej. 200 ml"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm opacity-70">Precio (MXN)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                type="number"
                value={Math.round(Number(form.price) / 100)}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) * 100 }))}
                placeholder="199"
              />
            </div>
            <div>
              <label className="text-sm opacity-70">Stock</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                type="number"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-sm opacity-70">Mínimo</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                type="number"
                value={form.minStock}
                onChange={(e) => setForm((f) => ({ ...f, minStock: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Descripción</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe el producto…"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Beneficios</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2"
              rows={3}
              value={form.benefits}
              onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
              placeholder={"Ej:\nSuaviza\nHidrata\nAroma agradable"}
            />
            <div className="mt-1 text-xs opacity-60">Tip: escribe uno por línea.</div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Modo de uso</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2"
              rows={3}
              value={form.howToUse}
              onChange={(e) => setForm((f) => ({ ...f, howToUse: e.target.value }))}
              placeholder="Cómo se usa…"
            />
          </div>

          {/* Imagen */}
          <div className="md:col-span-2 grid gap-3 md:grid-cols-2 items-start">
            <div>
              <label className="text-sm opacity-70">Imagen (subir archivo)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onPickImage(file);
                }}
              />
              <div className="mt-2 text-xs opacity-60">Se guardará como Base64 en la BD (ideal imágenes pequeñas).</div>

              <label className="mt-4 block text-sm opacity-70">O pegar URL de imagen</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={form.imageUrl || ""}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="rounded-2xl border p-3">
              <div className="text-sm font-semibold">Vista previa</div>
              <div className="mt-2 aspect-square w-full rounded-xl bg-gray-100 overflow-hidden">
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
              Visible en catálogo
            </label>

            <button className="rounded-2xl border px-5 py-2 font-semibold" onClick={save} disabled={saving}>
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="mt-6 overflow-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Producto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Visible</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const alert = p.stock <= 0 ? "AGOTADO" : p.stock <= p.minStock ? "BAJO" : "";
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs opacity-60">{p.slug}</div>
                    {alert ? <div className="mt-1 inline-flex rounded-full border px-2 py-1 text-xs">{alert}</div> : null}
                  </td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{money(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
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
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
