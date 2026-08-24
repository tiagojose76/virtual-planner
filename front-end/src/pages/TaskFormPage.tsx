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
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
        </h1>
        <Link
          to="/tasks"
          className="text-slate-400 hover:text-purple-400 transition-colors"
        >
          Voltar
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-purple-900/30 rounded-2xl p-6 space-y-6 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            >
              <option value="College">College</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Leisure">Leisure</option>
              <option value="PersonalProjects">Personal Projects</option>
              <option value="Study">Study</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Início (Minutos)
            </label>
            <input
              type="number"
              name="startMinutes"
              value={formData.startMinutes}
              onChange={handleChange}
              required
              min={0}
              max={1440}
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Fim (Minutos)
            </label>
            <input
              type="number"
              name="endMinutes"
              value={formData.endMinutes}
              onChange={handleChange}
              required
              min={0}
              max={1440}
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Prioridade
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-purple-900/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            >
              <option value="Pending">Pending</option>
              <option value="Executed">Executed</option>
              <option value="PartiallyExecuted">Partially Executed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Postponed">Postponed</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-900/30 flex justify-end gap-3">
          <Link
            to="/tasks"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-purple-300 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-900/50 transition-all disabled:opacity-50"
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
