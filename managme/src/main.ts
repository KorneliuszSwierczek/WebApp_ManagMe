import './style.css';
import { UserManager } from './storage/UserManager';
import { setupLoginForm } from './ui/loginForm';
import { renderApp } from './ui/mainApp';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const user = UserManager.getUser();

  if (user) {
    // Jeśli użytkownik zalogowany – uruchom aplikację
    renderApp();
  } else {
    // Ekran logowania
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
