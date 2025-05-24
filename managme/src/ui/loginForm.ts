import { AuthAPI } from '../api/AuthAPI';
import { renderApp } from './mainApp';

export function setupLoginForm(): void {
  const form = document.querySelector<HTMLFormElement>('#login-form')!;
  const login = document.querySelector<HTMLInputElement>('#login')!;
  const password = document.querySelector<HTMLInputElement>('#password')!;
  const errorBox = document.querySelector<HTMLDivElement>('#login-error')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = await AuthAPI.login(login.value, password.value);

    if (user) {
      renderApp(); // uruchamiamy główną aplikację
    } else {
      errorBox.textContent = 'Niepoprawny login lub hasło';
    }
  });
}
