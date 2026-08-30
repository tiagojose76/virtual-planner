import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import type { Task } from "../types/domain";
import { virtualPlannerApi } from "../lib/api/virtualPlannerApi";

export type TaskFormData = Omit<Task, "id">;

export function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [timeMode, setTimeMode] = useState<"exact" | "shift">("exact");
  const [shift, setShift] = useState<"Morning" | "Afternoon" | "Night">(
    "Morning",
  );

  const [formData, setFormData] = useState<TaskFormData>({
    description: "",
    category: "Study",
    date: new Date().toISOString().split("T")[0],
    startMinutes: 480,
    endMinutes: 540,
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      virtualPlannerApi
        .getTasks()
        .then((tasks) => {
          const taskFound = tasks.find((t) => t.id === Number(id));
          if (taskFound) {
            const { id: _, ...dataWithoutId } = taskFound;
            setFormData(dataWithoutId);
          }
        })
        .catch((err) => console.error("Erro ao carregar tarefa:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "startMinutes" || name === "endMinutes"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing && id) {
        await virtualPlannerApi.updateTask(Number(id), formData);
      } else {
        await virtualPlannerApi.createTask(formData);
      }
      navigate("/tasks");
    } catch (error) {
      console.error("Erro ao persistir a tarefa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-full transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
        </h1>
        <Link
          to="/tasks"
          className="text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Voltar
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-purple-900/30 rounded-2xl p-6 space-y-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            >
              <option value="College">Faculdade</option>
              <option value="Work">Trabalho</option>
              <option value="Health">Saúde</option>
              <option value="Leisure">Lazer</option>
              <option value="PersonalProjects">Projetos Pessoais</option>
              <option value="Study">Estudos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors dark:[color-scheme:dark]"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-gray-300 dark:border-purple-900/30 w-fit">
              <button
                type="button"
                onClick={() => setTimeMode("exact")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeMode === "exact" ? "bg-purple-600 text-white shadow-md" : "text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300"}`}
              >
                Horário Exato
              </button>
              <button
                type="button"
                onClick={() => setTimeMode("shift")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeMode === "shift" ? "bg-purple-600 text-white shadow-md" : "text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300"}`}
              >
                Turno do Dia
              </button>
            </div>

            {timeMode === "exact" ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Início (Minutos)
                  </label>
                  <input
                    type="number"
                    name="startMinutes"
                    value={formData.startMinutes}
                    onChange={handleChange}
                    min={0}
                    max={1440}
                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Fim (Minutos)
                  </label>
                  <input
                    type="number"
                    name="endMinutes"
                    value={formData.endMinutes}
                    onChange={handleChange}
                    min={0}
                    max={1440}
                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  Selecione o Turno
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 transition-colors"
                >
                  <option value="Morning">Manhã</option>
                  <option value="Afternoon">Tarde</option>
                  <option value="Night">Noite</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Prioridade
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            >
              <option value="Low">Baixa</option>
              <option value="Medium">Média</option>
              <option value="High">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-purple-900/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            >
              <option value="Pending">Pendente</option>
              <option value="Executed">Executada</option>
              <option value="PartiallyExecuted">Parcialmente Executada</option>
              <option value="Cancelled">Cancelada</option>
              <option value="Postponed">Adiada</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-purple-900/30 flex justify-end gap-3 mt-6">
          <Link
            to="/tasks"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-transparent dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            {isLoading
              ? "Salvando..."
              : isEditing
                ? "Salvar Alterações"
                : "Criar Tarefa"}
          </button>
        </div>
      </form>
    </div>
  );
}
