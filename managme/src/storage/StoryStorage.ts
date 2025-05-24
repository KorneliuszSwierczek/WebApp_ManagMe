import type { Story } from '../models/Story';

export class StoryStorage {
  private static key = 'stories';

  static getAll(): Story[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  static getByProject(projectId: string): Story[] {
    return this.getAll().filter(s => s.projectId === projectId);
  }

    static getById(id: string): Story | undefined {
    return this.getAll().find(s => s.id === id);
  }


  static save(story: Story): void {
    const stories = this.getAll();
    stories.push(story);
    localStorage.setItem(this.key, JSON.stringify(stories));
  }

  static delete(id: string): void {
    const filtered = this.getAll().filter(s => s.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered));
  }
}
