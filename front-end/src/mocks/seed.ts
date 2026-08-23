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
    description: "Ajustar tipos do front-end com o C++",
    category: "Study",
    date: "2026-08-20",
    startMinutes: 540, // 09:00
    endMinutes: 600, // 10:00
    priority: "High",
    status: "Executed",
  },
  {
    id: 2,
    description: "Implementar a estrutura do AppShell e Sidebar",
    category: "Work",
    date: "2026-08-20",
    startMinutes: 630, // 10:30
    endMinutes: 720, // 12:00
    priority: "High",
    status: "Pending",
  },
  {
    id: 3,
    description: "Treino da tarde",
    category: "Health",
    date: "2026-08-20",
    startMinutes: 1020, // 17:00
    endMinutes: 1080, // 18:00
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
];
