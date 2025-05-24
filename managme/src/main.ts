import './style.css';
import { setupLoginForm } from './ui/loginForm';
import { getCurrentUser } from './api/AuthAPI';
import { renderApp } from './ui/mainApp';

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const user = await getCurrentUser();

  if (user) {
    renderApp();
  } else {
    app.innerHTML = `
      <h1>Logowanie</h1>
      <form id="login-form">
        <input id="login" placeholder="Login" required />
        <input id="password" type="password" placeholder="Hasło" required />
        <button type="submit">Zaloguj się</button>
      </form>
      <div id="login-error" style="color: red; margin-top: 1rem;"></div>
    `;
    setupLoginForm();
  }
});
