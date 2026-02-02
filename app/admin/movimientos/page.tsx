"use client";

import { useEffect, useState } from "react";

export default function MovimientosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [movs, setMovs] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<"IN" | "OUT" | "ADJUST">("IN");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  async function load() {
    const psRes = await fetch("/api/admin/products");
    const ps = await psRes.json();
    setProducts(ps);

    const msRes = await fetch("/api/movements");
    const ms = await msRes.json();
    setMovs(ms);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    const res = await fetch("/api/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, type, qty: Number(qty), note }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Error");
      return;
    }
    setNote("");
    await load();
  }

  return (
    <main className="mx-auto max-w-6xl">
      <header className="flex items-center justify-between py-4">
        <div>
          <div className="text-2xl font-bold">Movimientos</div>
          <div className="text-sm opacity-70">Entrada suma, Salida resta, Ajuste permite +/-</div>
        </div>
        <a className="rounded-2xl border px-4 py-2" href="/admin/productos">← Volver</a>
      </header>

      <div className="rounded-2xl border p-4 grid gap-3 md:grid-cols-5">
        <select className="rounded-xl border px-3 py-2 md:col-span-2" value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">Selecciona producto</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select className="rounded-xl border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="IN">Entrada</option>
          <option value="OUT">Salida</option>
          <option value="ADJUST">Ajuste</option>
        </select>

        <input className="rounded-xl border px-3 py-2" type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />

        <input className="rounded-xl border px-3 py-2 md:col-span-5" placeholder="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />

        <button className="rounded-2xl border px-4 py-2 font-semibold md:col-span-2" onClick={add} disabled={!productId}>
          Guardar movimiento
        </button>
      </div>

      <div className="mt-6 overflow-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Fecha</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Nota</th>
            </tr>
          </thead>
          <tbody>
            {movs.map((m: any) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{new Date(m.createdAt).toLocaleString("es-MX")}</td>
                <td className="p-3">{m.product?.name}</td>
                <td className="p-3">{m.type}</td>
                <td className="p-3">{m.qty}</td>
                <td className="p-3">{m.note || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
