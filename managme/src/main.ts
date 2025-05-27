import './style.css'; // zostaje, jeśli masz własne style
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
      <div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
          <h2 class="mb-4 text-center">Logowanie</h2>
          <form id="login-form" novalidate>
            <div class="mb-3">
              <label for="login" class="form-label">Login</label>
              <input id="login" class="form-control" placeholder="Wprowadź login" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Hasło</label>
              <input id="password" type="password" class="form-control" placeholder="Wprowadź hasło" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Zaloguj się</button>
          </form>
          <div id="login-error" class="text-danger mt-3 text-center" style="min-height: 1.5em;"></div>
        </div>
      </div>
    `;
    setupLoginForm();
  }
});
