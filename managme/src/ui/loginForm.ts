import { login } from '../api/AuthAPI';
import { renderApp } from './mainApp';

export function setupLoginForm(): void {
  const form = document.querySelector<HTMLFormElement>('#login-form')!;
  const loginInput = document.querySelector<HTMLInputElement>('#login')!;
  const passwordInput = document.querySelector<HTMLInputElement>('#password')!;
  const errorBox = document.querySelector<HTMLDivElement>('#login-error')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const success = await login(loginInput.value, passwordInput.value);
    if (success) {
      renderApp();
    } else {
      errorBox.textContent = 'Niepoprawny login lub hasło';
    }
  });
}
