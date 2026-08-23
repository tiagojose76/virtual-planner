// src/mocks/seed.ts
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
    date: "2026-08-17", // Segunda
    startMinutes: 480, // 08:00
    endMinutes: 570, // 09:30
    priority: "Medium",
    status: "Executed",
  },
  {
    id: 2,
    description: "Reunião de alinhamento do projeto",
    category: "Work",
    date: "2026-08-18", // Terça
    startMinutes: 540, // 09:00
    endMinutes: 660, // 11:00
    priority: "High",
    status: "Executed",
  },
  {
    id: 3,
    description: "Sessão de estudos — React & TypeScript",
    category: "Study",
    date: "2026-08-19", // Quarta
    startMinutes: 510, // 08:30
    endMinutes: 600, // 10:00
    priority: "High",
    status: "Executed",
  },
  {
    id: 4,
    description: "Ajustar tipos do front-end com o C++",
    category: "Study",
    date: "2026-08-20", // Quinta
    startMinutes: 540, // 09:00
    endMinutes: 600, // 10:00
    priority: "High",
    status: "Executed",
  },
  {
    id: 5,
    description: "Implementar a estrutura do AppShell e Sidebar",
    category: "Work",
    date: "2026-08-20", // Quinta
    startMinutes: 630, // 10:30
    endMinutes: 720, // 12:00
    priority: "High",
    status: "Pending",
  },
  {
    id: 6,
    description: "Conflito proposital: Reunião de emergência",
    category: "Work",
    date: "2026-08-20", // Quinta (Conflita com a tarefa ID 5)
    startMinutes: 660, // 11:00
    endMinutes: 720, // 12:00
    priority: "High",
    status: "Pending",
  },
  {
    id: 7,
    description: "Curso — prática de visualização de dados",
    category: "Study",
    date: "2026-08-21", // Sexta
    startMinutes: 480, // 08:00
    endMinutes: 570, // 09:30
    priority: "Low",
    status: "Pending",
  },
  {
    id: 8,
    description: "Jantar em família",
    category: "Leisure",
    date: "2026-08-21", // Sexta
    startMinutes: 1140, // 19:00
    endMinutes: 1260, // 21:00
    priority: "High",
    status: "Cancelled",
  },
  {
    id: 9,
    description: "Revisar anotações da semana",
    category: "PersonalProjects",
    date: "2026-08-22", // Sábado
    startMinutes: 540, // 09:00
    endMinutes: 630, // 10:30
    priority: "Medium",
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
  {
    id: 3,
    description: "Ler 2 livros técnicos este mês",
    category: "Study",
    status: "Partially Completed",
    period: "Monthly",
  },
  {
    id: 4,
    description: "Finalizar o protótipo do Planner em React",
    category: "PersonalProjects",
    status: "In Progress",
    period: "Monthly",
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 1,
    description: "Beber água e esticar as pernas",
    category: "Health",
    date: "2026-08-20",
    startMinutes: 600, // 10:00
    endMinutes: 610, // 10:10
    type: "Exercise",
    recurrence: "Daily",
  },
  {
    id: 2,
    description: "Entrega do relatório semanal",
    category: "Work",
    date: "2026-08-21",
    startMinutes: 1020, // 17:00
    endMinutes: 1050, // 17:30
    type: "Assignment",
    recurrence: "Weekly",
  },
];
