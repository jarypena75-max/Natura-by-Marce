import { whatsappLink } from "@/lib/whatsapp";

export default function ContactoPage() {
  const wa = whatsappLink("Hola Marce 👋 Me gustaría información del catálogo Natura.");
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Contacto</h1>
      <p className="opacity-80">Escríbele a Marce para pedidos y dudas.</p>

      <a className="inline-flex rounded-2xl border px-4 py-2 font-semibold" href={wa}>
        WhatsApp
      </a>
    </main>
  );
}
