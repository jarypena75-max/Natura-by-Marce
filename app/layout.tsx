import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b">
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <div className="font-bold">Natura by Marce</div>

            <div className="flex items-center gap-4">
              <nav className="flex gap-4 text-sm">
                <Link href="/catalogo">Catálogo</Link>
                <Link href="/promos">Promos</Link>
                <Link href="/como-comprar">Cómo comprar</Link>
                <Link href="/contacto">Contacto</Link>
              </nav>

              {/* Acceso discreto a admin */}
              <Link
                href="/admin/login"
                className="text-xs rounded-full border px-3 py-1 opacity-70 hover:opacity-100"
                title="Solo para Marce"
              >
                ¿Eres Marce? Admin
              </Link>
            </div>
          </div>
        </header>

        {children}

        <footer className="mx-auto max-w-6xl p-4 opacity-70 text-sm">
          © {new Date().getFullYear()} Natura by Marce
        </footer>
      </body>
    </html>
  );
}