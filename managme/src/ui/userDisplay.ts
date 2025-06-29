import { UserManager } from '../storage/UserManager';

export function renderUser(): void {
  const container = document.querySelector<HTMLDivElement>('#user-info')!;
  const user = UserManager.getUser();

  if (user) {
    container.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-person-circle fs-4 text-primary"></i>
        <span class="fw-bold">Zalogowany jako:</span> 
        <span class="text-muted">${user.firstName} ${user.lastName} ${user.role}</span>
        <button id="logout-btn" class="btn btn-sm btn-outline-danger ms-2">Wyloguj się</button>
      </div>
    `;

    const logoutBtn = document.querySelector<HTMLButtonElement>('#logout-btn');
    logoutBtn?.addEventListener('click', () => {
      UserManager.logout();
      window.location.reload();
    });

  } else {
    container.innerHTML = `
      <div class="text-danger fw-bold">
        Brak zalogowanego użytkownika
      </div>
    `;
  }
}
