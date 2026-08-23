export type Category =
  | "College"
  | "Work"
  | "Health"
  | "Leisure"
  | "PersonalProjects"
  | "Study";

export type GoalPeriod = "Weekly" | "Monthly" | "Yearly";

export type GoalStatus =
  | "In Progress"
  | "Completed"
  | "Partially Completed"
  | "Failed";

export type Priority = "Low" | "Medium" | "High";

export type ReminderRecurrence = "Once" | "Daily" | "Weekly" | "Monthly";

export type ReminderType =
  | "Meeting"
  | "PhoneCall"
  | "Shopping"
  | "Study"
  | "Exercise"
  | "Assignment";

export type Shift = "Morning" | "Afternoon" | "Evening";

export type TaskStatus =
  | "Pending"
  | "Executed"
  | "PartiallyExecuted"
  | "Cancelled"
  | "Postponed";

// Para aplicar a regra de sobreposição de horários (TimeSlot::overlaps)
export interface TimeSlot {
  date: string;
  startMinutes: number;
  endMinutes: number;
}

// Para controlar a navegação entre as 9 visões do Planner
export type PlannerView =
  | "calendar"
  | "timeline"
  | "category"
  | "status"
  | "duration-category"
  | "duration-status"
  | "duration-time"
  | "priority"
  | "all";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  description: string;
  category: Category;
  date: string; // YYYY-MM-DD
  startMinutes: number;
  endMinutes: number;
  priority: Priority;
  status: TaskStatus;
}

export interface Goal {
  id: number;
  description: string;
  category: Category;
  status: GoalStatus;
  period: GoalPeriod;
}

export interface Reminder {
  id: number;
  description: string;
  category: Category;
  date: string;
  startMinutes: number;
  endMinutes: number;
  type: ReminderType;
  recurrence: ReminderRecurrence;
}
