import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { virtualPlannerApi } from "../lib/api/virtualPlannerApi";
import type { Task } from "../types/domain";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    try {
      const data = await virtualPlannerApi.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja realmente excluir esta tarefa?")) return;

    try {
      // 1. Manda a ordem de exclusão para a API
      await virtualPlannerApi.deleteTask(id);

      // 2. Atualização Otimista: Limpa da RAM na hora sem precisar baixar tudo de novo
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }

  // Estados locais para os filtros da tela
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredTasks = tasks.filter((task) => {
    const matchCategory =
      selectedCategory === "ALL" || task.category === selectedCategory;
    const matchPriority =
      selectedPriority === "ALL" || task.priority === selectedPriority;
    const matchStatus =
      selectedStatus === "ALL" || task.status === selectedStatus;

    return matchCategory && matchPriority && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-900/30 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Gerenciamento de Tarefas
          </h1>
          <p className="text-sm text-gray-400">
            Filtre e controle o andamento das suas atividades.
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-lg shadow-purple-900/20"
        >
          + Nova Tarefa
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
        {/* Caixa de seleção da Categoria */}
        <div>
          <label className="block text-xs font-semibold text-purple-300 mb-1">
            CATEGORIA
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-2 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="College">Faculdade</option>
            <option value="Work">Trabalho</option>
            <option value="Health">Saúde</option>
            <option value="Leisure">Lazer</option>
            <option value="Study">Estudo</option>
            <option value="PersonalProjects">Projetos Pessoais</option>
          </select>
        </div>

        {/* Caixa de seleção da Prioridade */}
        <div>
          <label className="block text-xs font-semibold text-purple-300 mb-1">
            PRIORIDADE
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-2 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Todas as Prioridades</option>
            <option value="High">Alta</option>
            <option value="Medium">Média</option>
            <option value="Low">Baixa</option>
          </select>
        </div>

        {/* Caixa de seleção do Status */}
        <div>
          <label className="block text-xs font-semibold text-purple-300 mb-1">
            STATUS
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-2 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="Pending">Pendente</option>
            <option value="Executed">Executada</option>
            <option value="PartiallyExecuted">Parcialmente Executada</option>
            <option value="Cancelled">Cancelada</option>
            <option value="Postponed">Adiada</option>
          </select>
        </div>
      </div>

      {/*SEÇÃO DA TABELA DE DADOS*/}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-xl">
        {/* Se estiver carregando, mostra texto animado */}
        {isLoading ? (
          <div className="p-8 text-center text-purple-400 animate-pulse font-medium">
            Carregando tarefas...
          </div>
        ) : filteredTasks.length === 0 ? (
          /* Se a lista filtrada veio vazia, avisa o usuário */
          <div className="p-8 text-center text-gray-500 italic">
            Nenhuma tarefa encontrada com os filtros atuais.
          </div>
        ) : (
          /* desenha a tabela HTML padrão */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800 text-xs text-purple-300 uppercase tracking-wider">
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Prioridade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-200">
                      {task.description}
                    </td>
                    <td className="p-4 text-gray-400">{task.category}</td>
                    <td className="p-4 text-gray-400">{task.date}</td>

                    {/* Badge condicional de Prioridade (Vermelho para High, Amarelo para Medium, Azul para Low) */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.priority === "High"
                            ? "text-red-400 bg-red-950/40"
                            : task.priority === "Medium"
                              ? "text-yellow-400 bg-yellow-950/40"
                              : "text-blue-400 bg-blue-950/40"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Badge condicional de Status (Verde se Executado, Cinza se Pendente) */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.status === "Executed"
                            ? "text-green-400 bg-green-950/40"
                            : "text-gray-300 bg-gray-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/tasks/${task.id}/edit`}
                        className="text-purple-400 hover:text-purple-300 font-medium text-xs px-2 py-1 bg-purple-950/30 rounded border border-purple-900/50"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-400 hover:text-red-300 font-medium text-xs px-2 py-1 bg-red-950/30 rounded border border-red-900/50"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
