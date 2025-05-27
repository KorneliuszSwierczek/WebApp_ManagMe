import { UserManager } from '../storage/UserManager';

export function renderUser(): void {
  const container = document.querySelector<HTMLDivElement>('#user-info')!;
  const user = UserManager.getUser();

  if (user) {
    container.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-person-circle fs-4 text-primary"></i>
        <span class="fw-bold">Zalogowany jako:</span> 
        <span class="text-muted">${user.firstName} ${user.lastName}</span>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="text-danger fw-bold">
        Brak zalogowanego użytkownika
      </div>
    `;
  }
}
