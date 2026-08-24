import { useEffect, useState } from "react";
import { virtualPlannerApi } from "../lib/api/virtualPlannerApi";
import type { Task, Goal, Reminder } from "../types/domain";

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data fixa para bater com os nossos mocks (apenas para testes)
  const TODAY = "2026-08-20";

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // Dispara as 3 requisições ao mesmo tempo (Concorrência)
        const [fetchedTasks, fetchedGoals, fetchedReminders] =
          await Promise.all([
            virtualPlannerApi.getTasks(),
            virtualPlannerApi.getGoals(),
            virtualPlannerApi.getReminders(),
          ]);

        setTasks(fetchedTasks);
        setGoals(fetchedGoals);
        setReminders(fetchedReminders);
      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Lógica de Negócio: Filtragem de dados com complexidade O(N)
  const todayTasks = tasks.filter((t) => t.date === TODAY);
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const inProgressGoals = goals.filter((g) => g.status === "In Progress");
  const todayReminders = reminders.filter((r) => r.date === TODAY);

  // Early Return (Se estiver carregando, bloqueia a renderização principal)
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-purple-500 font-bold text-xl animate-pulse">
          Carregando seu planejamento...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center border-b border-purple-900/30 pb-4">
        <h1 className="text-3xl font-bold text-white">Resumo do Dia</h1>

        {/* Botões de Ação Rápida */}
        <div className="flex gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            + Nova Tarefa
          </button>
          <button className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-4 py-2 rounded-md font-medium transition-colors">
            + Nova Meta
          </button>
        </div>
      </header>

      {/* Grid Layout (Equivalente a matrizes visuais) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna 1: Tarefas */}
        <section className="col-span-2 bg-gray-900 rounded-lg p-5 border border-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">
            Tarefas de Hoje
          </h2>
          {todayTasks.length === 0 ? (
            <p className="text-gray-500 italic">Nenhuma tarefa para hoje.</p>
          ) : (
            <ul className="space-y-3">
              {todayTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-3 bg-gray-800 rounded border-l-4 border-purple-500"
                >
                  <span className="text-gray-200">{task.description}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${task.status === "Executed" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}`}
                  >
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Coluna 2: Metas e Lembretes */}
        <div className="space-y-6">
          <section className="bg-gray-900 rounded-lg p-5 border border-gray-800 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-purple-300">
              Metas em Andamento
            </h2>
            <ul className="space-y-2">
              {inProgressGoals.map((goal) => (
                <li
                  key={goal.id}
                  className="text-sm text-gray-300 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  {goal.description}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-900 rounded-lg p-5 border border-gray-800 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-purple-300">
              Próximos Lembretes
            </h2>
            <ul className="space-y-2">
              {todayReminders.map((reminder) => (
                <li
                  key={reminder.id}
                  className="text-sm text-gray-300 bg-purple-900/20 p-2 rounded border border-purple-500/30"
                >
                  <span className="block font-medium text-purple-400">
                    {reminder.type}
                  </span>
                  {reminder.description}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
