"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Instantiate client so Supabase can process the OAuth callback URL.
    const supabase = getSupabaseClient();
    void supabase;

    const timeout = setTimeout(() => {
      router.replace("/");
    }, 500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="app-shell">
      <div className="rule" />
      <p className="eyebrow">Finishing sign-in…</p>
    </div>
  );
}

