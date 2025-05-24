export type TaskState = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedTime: number;
  state: TaskState;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  assignedUserId?: string;
  workedHours?: number;
}
