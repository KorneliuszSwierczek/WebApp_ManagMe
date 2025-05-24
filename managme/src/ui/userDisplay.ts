import { UserManager } from '../storage/UserManager';

export function renderUser(): void {
  const container = document.querySelector<HTMLDivElement>('#user-info')!;
  const user = UserManager.getUser();

  if (user) {
    container.textContent = `Zalogowany jako: ${user.firstName} ${user.lastName}`;
  } else {
    container.textContent = 'Brak zalogowanego użytkownika';
  }
}