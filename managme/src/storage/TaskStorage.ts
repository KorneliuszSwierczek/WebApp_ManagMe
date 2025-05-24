import type { Task } from '../models/Task';

export class TaskStorage {
  private static key = 'tasks';

  static getAll(): Task[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  static getByStory(storyId: string): Task[] {
    return this.getAll().filter(t => t.storyId === storyId);
  }

  static getById(id: string): Task | undefined {
    return this.getAll().find(t => t.id === id);
  }

  static save(task: Task): void {
    const tasks = this.getAll();
    tasks.push(task);
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }

  static update(task: Task): void {
    const tasks = this.getAll().map(t => t.id === task.id ? task : t);
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }

  static delete(id: string): void {
    const filtered = this.getAll().filter(t => t.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered));
  }

  static clearAll(): void {
    localStorage.removeItem(this.key);
  }
}
