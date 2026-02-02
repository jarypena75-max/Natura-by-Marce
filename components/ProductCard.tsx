import Link from "next/link";
import { money } from "@/components/money";

export default function ProductCard({ p }: { p: any }) {
  const badge =
    p.stock <= 0 ? "Agotado" : p.stock <= p.minStock ? "Últimas piezas" : "Disponible";

  return (
    <Link href={`/producto/${p.slug}`} className="block rounded-2xl border p-3 hover:shadow-md">
      <div className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="mt-3">
        <div className="text-xs opacity-70">{p.category}</div>
        <div className="font-semibold leading-tight">{p.name}</div>
        <div className="mt-1 font-bold">{money(p.price)}</div>
        <div className="mt-2 text-xs">
          <span className="inline-flex rounded-full border px-2 py-1">{badge}</span>
        </div>
      </div>
    </Link>
  );
}
