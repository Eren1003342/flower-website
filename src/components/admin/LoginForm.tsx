"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Kullanıcı adı veya şifre yanlış.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-cream-50/90 mb-2">Kullanıcı Adı</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-2xl border border-cream-50/35 dark:border-slate-700 bg-cream-50/95 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-cream-50 outline-none focus:border-rose-300 dark:focus:border-sage-500 focus:ring-2 focus:ring-rose-200/60 dark:focus:ring-sage-500/30"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-cream-50/90 mb-2">Şifre</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-cream-50/35 dark:border-slate-700 bg-cream-50/95 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-cream-50 outline-none focus:border-rose-300 dark:focus:border-sage-500 focus:ring-2 focus:ring-rose-200/60 dark:focus:ring-sage-500/30"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-sage-800 text-cream-50 py-3 font-semibold hover:bg-sage-900 transition-colors disabled:opacity-70"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
