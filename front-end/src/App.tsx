import { useState, useEffect } from "react";
import { AppShell } from "./components/AppShell";

type ThemeMode = "light" | "dark" | "system";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    root.classList.remove("dark");

    if (theme === "dark" || (theme === "system" && systemPrefersDark)) {
      root.classList.add("dark");
    }
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const handleQuickCreate = () => {
    alert("Abrindo modal de nova tarefa...");
  };

  return (
    <AppShell
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onQuickCreate={handleQuickCreate}
      theme={theme}
      onThemeChange={handleThemeChange}
    >
      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Visão Geral
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          A moldura do Virtual Planner está pronta! O modo {theme} está ativado.
        </p>
      </div>
    </AppShell>
  );
}
