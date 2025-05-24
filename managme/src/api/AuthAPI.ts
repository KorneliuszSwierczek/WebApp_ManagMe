import { UserManager } from '../storage/UserManager';
import type { User } from '../models/User';

export class AuthAPI {
  static async login(login: string, password: string): Promise<User | null> {
    // MOCK: login = imię.lowercase, hasło = "123"
    const users = UserManager.getAllUsers();
    const user = users.find(u => u.firstName.toLowerCase() === login.toLowerCase());

    if (user && password === '123') {
      localStorage.setItem('loggedUser', JSON.stringify(user));
      return user;
    }

    return null;
  }
}
