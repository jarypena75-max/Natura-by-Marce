"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Error");
      return;
    }
    router.push("/admin/productos");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Acceso Inventario</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl border p-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-xl border px-3 py-2"
        />
        {err ? <div className="text-sm text-red-600">{err}</div> : null}
        <button className="w-full rounded-2xl border px-4 py-2 font-semibold">
          Entrar
        </button>
      </form>
    </main>
  );
}
