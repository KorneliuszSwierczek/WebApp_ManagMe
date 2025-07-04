import type { User } from '../models/User';

export class UserManager {
  private static currentUserKey = 'loggedUser';

  private static users: User[] = [
    { id: '1', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
    { id: '2', firstName: 'Anna', lastName: 'Nowak', role: 'developer' },
    { id: '3', firstName: 'Piotr', lastName: 'Zieliński', role: 'devops' }
  ];

  static setMockUser(): void {
    const admin = this.users.find(u => u.role === 'admin')!;
    localStorage.setItem(this.currentUserKey, JSON.stringify(admin));
  }

  static setUser(user: User): void {
  localStorage.setItem(this.currentUserKey, JSON.stringify(user));
}
  static getUser(): User | null {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }

  static getAllUsers(): User[] {
    return this.users;
  }

  static logout(): void {
  localStorage.removeItem(this.currentUserKey);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

}
