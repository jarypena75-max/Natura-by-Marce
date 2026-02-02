export default function ComoComprarPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Cómo comprar</h1>
      <ol className="list-decimal space-y-2 pl-5 opacity-80">
        <li>Explora el catálogo y abre la ficha del producto.</li>
        <li>Da clic en <b>Pedir por WhatsApp</b>.</li>
        <li>Marce confirma disponibilidad, total y forma de pago.</li>
        <li>Coordinan entrega (punto de encuentro / recolección / entrega local si aplica).</li>
      </ol>
      <div className="rounded-2xl border p-4 text-sm opacity-80">
        Nota: No hay envíos automáticos desde el sitio. La compra se coordina por WhatsApp.
      </div>
    </main>
  );
}
