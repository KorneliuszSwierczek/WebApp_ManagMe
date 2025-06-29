import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { setupLoginForm } from './ui/loginForm';
import { getCurrentUser } from './api/AuthAPI';
import { renderApp } from './ui/mainApp';

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('Nie znaleziono kontenera #app w DOM');
    return;
  }

  console.log('🌐 DOM załadowany');

  try {
    const user = await getCurrentUser();
    console.log('🔐 Dane użytkownika:', user);

    if (user) {
      console.log('✅ Użytkownik znaleziony, renderuję aplikację');
      renderApp();
    } else {
      console.log('❌ Brak użytkownika – pokazuję formularz logowania');

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

  } catch (err) {
    console.error('❗ Błąd podczas ładowania aplikacji:', err);
    app.innerHTML = `<p class="text-center text-danger mt-5">Wystąpił błąd przy ładowaniu aplikacji. Sprawdź konsolę.</p>`;
  }
});
