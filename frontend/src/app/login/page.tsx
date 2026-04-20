"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { Eyebrow } from "@/components/Eyebrow";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await authApi.login({ email, password });
      saveToken(res.token);
      router.push("/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md flex-col justify-center px-6 py-12">
      <Eyebrow>Welcome back</Eyebrow>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
        Log <span className="italic text-terracotta">in</span>.
      </h1>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={setEmail}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={setPassword}
        />
        {error && <p className="text-sm text-terracotta">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-2">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-terracotta underline-offset-4 hover:underline"
        >
          Register
        </Link>
      </p>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink transition placeholder:text-ink-2/50 focus:border-terracotta focus:outline-none"
        {...rest}
      />
    </label>
  );
}
