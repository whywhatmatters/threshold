"use client";

import { useState, useEffect } from "react";
import type { Language } from "@/types";
import {
  getStoredLanguage,
  setStoredLanguage,
  getStoredLanguageAsync,
  setStoredLanguageAsync,
} from "@/lib/storage";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { TodayScreen } from "@/components/screens/TodayScreen";
import { JournalScreen } from "@/components/screens/JournalScreen";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { SignInScreen } from "@/components/screens/SignInScreen";

export type Screen = "today" | "journal" | "about" | "settings";

function AppContent() {
  const { user, idToken, loading, configured, signInWithGoogle } = useAuth();
  const [screen, setScreen] = useState<Screen>("today");
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  const uid = user?.id ?? null;

  useEffect(() => {
    if (!mounted) {
      if (configured && uid) {
        getStoredLanguageAsync(uid).then(setLanguage).finally(() => setMounted(true));
      } else {
        setLanguage(getStoredLanguage());
        setMounted(true);
      }
    }
  }, [configured, uid, mounted]);

  useEffect(() => {
    if (mounted && uid) {
      getStoredLanguageAsync(uid).then(setLanguage);
    }
  }, [uid, mounted]);

  async function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    await setStoredLanguageAsync(lang, uid);
    if (!uid) setStoredLanguage(lang);
  }

  if (!mounted || loading) return null;

  if (configured && !user) {
    return (
      <div className="app-shell">
        <Header language={language} userEmail={null} />
        <SignInScreen
          language={language}
          onSignIn={signInWithGoogle}
          loading={loading}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header language={language} userEmail={user?.email ?? null} />

      {screen === "today" && (
        <TodayScreen language={language} idToken={idToken} uid={uid} />
      )}
      {screen === "journal" && (
        <JournalScreen language={language} uid={uid} />
      )}
      {screen === "about" && (
        <AboutScreen language={language} />
      )}
      {screen === "settings" && (
        <SettingsScreen
          language={language}
          onLanguageChange={handleLanguageChange}
          uid={uid}
        />
      )}

      <BottomNav current={screen} language={language} onNavigate={setScreen} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
