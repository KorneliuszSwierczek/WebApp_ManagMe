export class ActiveProject {
  private static key = 'activeProjectId';

  static set(id: string): void {
    localStorage.setItem(this.key, id);
  }

  static get(): string | null {
    return localStorage.getItem(this.key);
  }

  static clear(): void {
    localStorage.removeItem(this.key);
  }
}