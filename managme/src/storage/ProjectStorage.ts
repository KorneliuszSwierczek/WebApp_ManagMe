import type { Project } from '../models/Project';

export class ProjectStorage {
  private static key = 'projects';

  static getProjects(): Project[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  static saveProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    localStorage.setItem(this.key, JSON.stringify(projects));
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(this.key, JSON.stringify(projects));
  }

  static clearAll(): void {
    localStorage.removeItem(this.key);
  }
}
