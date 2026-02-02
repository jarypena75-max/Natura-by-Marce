"use client";

export default function FiltersBar({
  q, setQ, category, setCategory, inStock, setInStock, categories
}: {
  q: string; setQ: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  inStock: boolean; setInStock: (v: boolean) => void;
  categories: string[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-3 md:flex-row md:items-center">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar (ej. perfume, crema, shampoo...)"
        className="w-full rounded-xl border px-3 py-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 md:w-64"
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        Solo disponibles
      </label>
    </div>
  );
}
