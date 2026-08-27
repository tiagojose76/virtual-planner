import type { Task, Goal, Reminder, User } from "../types/domain";

export const mockUser: User = {
  id: 1,
  name: "Desenvolvedor Principal",
  email: "dev@virtualplanner.com",
};

export const mockTasks: Task[] = [
  {
    id: 1,
    description: "Treino da manhã — força + mobilidade",
    category: "Health",
    date: "2026-08-17",
    startMinutes: 480, // 08:00
    endMinutes: 570, // 09:30
    priority: "Medium",
    status: "Executed",
    color: "#10B981", // Verde para saúde
  },
  {
    id: 2,
    description: "Reunião de alinhamento do projeto",
    category: "Work",
    date: "2026-08-18",
    startMinutes: 540,
    endMinutes: 660,
    priority: "High",
    status: "Executed",
  },
  {
    id: 3,
    description: "Sessão de estudos — React & TypeScript",
    category: "Study",
    date: "2026-08-19",
    startMinutes: 510,
    endMinutes: 600,
    priority: "High",
    status: "Executed",
    color: "#8B5CF6", // O nosso roxo para destaque de estudos
  },
  {
    id: 4,
    description: "Ajustar tipos do front-end com o C++",
    category: "Study",
    date: "2026-08-20",
    startMinutes: 540,
    endMinutes: 600,
    priority: "High",
    status: "Executed",
  },
  {
    id: 5,
    description: "Implementar a estrutura do AppShell e Sidebar",
    category: "Work",
    date: "2026-08-20",
    shift: "Morning",
    priority: "High",
    status: "Pending",
    color: "#8B5CF6",
  },
  {
    id: 6,
    description: "Conflito proposital: Reunião de emergência",
    category: "Work",
    date: "2026-08-20",
    startMinutes: 660,
    endMinutes: 720,
    priority: "High",
    status: "Pending",
  },
  {
    id: 7,
    description: "Curso — prática de visualização de dados",
    category: "Study",
    date: "2026-08-21",
    shift: "Afternoon",
    priority: "Low",
    status: "Pending",
  },
];

export const mockGoals: Goal[] = [
  {
    id: 1,
    description: "Concluir a integração do front-end com a API",
    category: "Work",
    status: "In Progress",
    period: "Weekly",
  },
  {
    id: 2,
    description: "Manter rotina de treino 4x por semana",
    category: "Health",
    status: "Completed",
    period: "Weekly",
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 1,
    description: "Beber água e esticar as pernas",
    category: "Health",
    date: "2026-08-20",
    startMinutes: 600,
    endMinutes: 610,
    type: "Exercise",
    recurrence: "Daily",
  },
];
