import type { User } from '../models/user';

export class UserManager {
  private static key = 'loggedUser';

  static getUser(): User | null {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  static setMockUser(): void {
    const mockUser: User = {
      id: '1',
      firstName: 'Korneliusz',
      lastName: 'Świerczek'
    };
    localStorage.setItem(this.key, JSON.stringify(mockUser));
  }

  static clear(): void {
    localStorage.removeItem(this.key);
  }
}