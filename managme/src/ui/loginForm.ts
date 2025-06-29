import { login, getCurrentUser } from '../api/AuthAPI';
import { renderApp } from './mainApp';
import { UserManager } from '../storage/UserManager';

export function setupLoginForm(): void {
  const form = document.querySelector<HTMLFormElement>('#login-form')!;
  const loginInput = document.querySelector<HTMLInputElement>('#login')!;
  const passwordInput = document.querySelector<HTMLInputElement>('#password')!;
  const errorBox = document.querySelector<HTMLDivElement>('#login-error')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.textContent = ''; 
    const success = await login(loginInput.value, passwordInput.value);

    if (success) {
      const user = await getCurrentUser();
      if (user) {
        UserManager.setUser(user);
        renderApp();
      } else {
        errorBox.textContent = 'Nie udało się pobrać danych użytkownika';
      }
    } else {
      errorBox.textContent = 'Niepoprawny login lub hasło';
    }
  });
}
