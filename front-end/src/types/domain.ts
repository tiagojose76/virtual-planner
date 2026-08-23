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
