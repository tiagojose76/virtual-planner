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
  return (
    <div className="flex h-screen bg-[#191919] text-slate-200 overflow-hidden">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Coluna Direita (Header + Miolo) */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Topo Fixo da Coluna Direita */}
        <Header
          currentTab={currentTab}
          onQuickCreate={onQuickCreate}
          theme={theme}
          onThemeChange={onThemeChange}
        />

        {/* Área de Injeção das Telas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};
