"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  configured: boolean;
}

const defaultState: AuthState = {
  user: null,
  idToken: null,
  loading: true,
  configured: false,
};

const AuthContext = createContext<AuthState & {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}>({
  ...defaultState,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshToken: async () => null,
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token ?? null;
    setState((s) =>
      s.idToken === token ? s : { ...s, idToken: token, user: data.session?.user ?? null }
    );
    return token;
  }, []);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    // Temporary debug logging to verify auth gating
    console.log("[Auth] Supabase configured:", configured);
    if (!configured) {
      setState({ user: null, idToken: null, loading: false, configured: false });
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setState({ user: null, idToken: null, loading: false, configured: true });
      return;
    }

    // Initial session load
    supabase.auth.getSession().then(({ data }) => {
      console.log("[Auth] Initial session user:", data.session?.user ?? null);
      setState({
        user: data.session?.user ?? null,
        idToken: data.session?.access_token ?? null,
        loading: false,
        configured: true,
      });
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        idToken: session?.access_token ?? null,
        loading: false,
        configured: true,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setState((s) => ({ ...s, user: null, idToken: null }));
  }, []);

  const value = {
    ...state,
    signInWithGoogle,
    signOut,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

