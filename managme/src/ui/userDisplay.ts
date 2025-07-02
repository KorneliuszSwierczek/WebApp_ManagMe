import { UserManager } from '../storage/UserManager';

export function renderUser(): void {
  const container = document.querySelector<HTMLDivElement>('#user-info')!;
  const user = UserManager.getUser();

  if (user) {
    container.innerHTML = `
      <div class="d-flex align-items-center gap-2 text-white">
        <i class="bi bi-person-circle fs-5"></i>
        <div class="d-none d-md-block">
          <span class="fw-semibold">Zalogowany jako:</span> 
          <span class="text-light">${user.firstName} ${user.lastName}</span>
          <span class="badge bg-light text-dark ms-2 text-uppercase">${user.role}</span>
        </div>
        <button id="logout-btn" class="btn btn-sm btn-outline-light ms-3">Wyloguj się</button>
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
