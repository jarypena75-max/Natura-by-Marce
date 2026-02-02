import { prisma } from "@/lib/prisma";
import { whatsappLink } from "@/lib/whatsapp";
import Link from "next/link";
import { money } from "@/components/money";

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!p || !p.isActive) return <div className="p-6">Producto no encontrado.</div>;

  const badge =
    p.stock <= 0 ? "Agotado" : p.stock <= p.minStock ? "Últimas piezas" : "Disponible";

  const wa = whatsappLink(
    `Hola Marce 👋 Quiero el producto: ${p.name} (${p.size}). ¿Hay disponible?`
  );

  return (
    <main>
      <Link href="/catalogo" className="text-sm underline">← Volver al catálogo</Link>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden">
          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : null}
        </div>

        <div>
          <div className="text-sm opacity-70">{p.category}</div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <div className="mt-2 inline-flex rounded-full border px-3 py-1 text-sm">{badge}</div>

          <div className="mt-4 text-2xl font-bold">{money(p.price)}</div>
          <div className="mt-1 opacity-80">{p.size}</div>

          <div className="mt-5 space-y-3">
            <div>
              <div className="font-semibold">Descripción</div>
              <div className="opacity-80 whitespace-pre-line">{p.description}</div>
            </div>
            <div>
              <div className="font-semibold">Beneficios</div>
              <div className="opacity-80 whitespace-pre-line">{p.benefits}</div>
            </div>
            <div>
              <div className="font-semibold">Modo de uso</div>
              <div className="opacity-80 whitespace-pre-line">{p.howToUse}</div>
            </div>
          </div>

          <a
            href={wa}
            className={`mt-6 inline-flex w-full justify-center rounded-2xl px-4 py-3 font-semibold border ${
              p.stock <= 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
