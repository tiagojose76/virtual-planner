import type { FC, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

type ThemeMode = "light" | "dark" | "system";

interface AppShellProps {
  children?: ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onQuickCreate: () => void;
  theme: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export const AppShell: FC<AppShellProps> = ({
  children,
  currentTab,
  setCurrentTab,
  onQuickCreate,
  theme,
  onThemeChange,
}) => {
  const activeTab = currentTab ? currentTab.split("/")[0] : "dashboard";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-200 overflow-hidden transition-colors duration-300">
      <Sidebar currentTab={activeTab} setCurrentTab={setCurrentTab} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header
          currentTab={activeTab}
          onQuickCreate={onQuickCreate}
          theme={theme}
          onThemeChange={onThemeChange}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
