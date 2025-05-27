import { setupProjectForm } from './projectForm';
import { renderProjects } from './projectList';
import { renderUser } from './userDisplay';
import { renderProjectSelector } from './projectSelector';
import { setupStoryForm } from './storyForm';
import { renderStoryList } from './storyList';
import { setupTaskForm } from './taskForm';
import { renderKanban } from './taskKanban';
import { UserManager } from '../storage/UserManager';

/**
 * Funkcja do wyświetlania dynamicznych alertów Bootstrap
 * @param message Treść komunikatu
 * @param type Typ alertu: 'success', 'danger', 'warning', 'info'
 */
function showAlert(message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  const alertsContainer = document.getElementById('alerts');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = 'alert';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertsContainer.appendChild(alert);

  // Automatyczne ukrycie po 5 sekundach
  setTimeout(() => {
    alert.classList.remove('show');
    alert.classList.add('hide');
    setTimeout(() => alert.remove(), 200); // Czas na animację
  }, 5000);
}

export function renderApp(): void {
  const user = UserManager.getUser();
  const app = document.querySelector<HTMLDivElement>('#app')!;
  if (!user) return;

  app.innerHTML = `
    <div class="d-flex flex-column min-vh-100">
      <div class="container my-5 flex-grow-1">
        <div class="bg-white p-5 rounded shadow-sm border">
          

          <header class="mb-5 text-center">
            <h1 class="display-6 fw-bold text-primary">ManagMe – System zarządzania projektami</h1>
          </header>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div id="user-info" class="fw-bold"></div>
            <div id="project-selector" class="w-25"></div>
          </div>

          <div id="alerts"></div>

          <!-- Sekcja projektów -->
          <section class="mb-5">
            <h2 class="h4 mb-3">Dodaj nowy projekt</h2>
            <form id="project-form" class="row g-3">
              <div class="col-md-6">
                <input id="name" placeholder="Nazwa projektu" required class="form-control" />
              </div>
              <div class="col-md-6">
                <input id="description" placeholder="Opis projektu" required class="form-control" />
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary">Dodaj projekt</button>
              </div>
            </form>
            <ul id="project-list" class="list-group mt-4"></ul>
          </section>

          <!-- Sekcja historyjek -->
          <section class="mb-5">
            <h2 class="h4 mb-3">Historyjki projektu</h2>
            <form id="story-form" class="row g-3">
              <div class="col-md-4">
                <input id="story-name" placeholder="Nazwa historyjki" required class="form-control" />
              </div>
              <div class="col-md-4">
                <input id="story-description" placeholder="Opis" required class="form-control" />
              </div>
              <div class="col-md-4">
                <select id="story-priority" class="form-select">
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-success">Dodaj historyjkę</button>
              </div>
            </form>
            <div id="story-list" class="mt-4"></div>
          </section>

          <!-- Sekcja zadań -->
          <section class="mb-5">
            <h2 class="h4 mb-3">Dodaj zadanie</h2>
            <form id="task-form" class="row g-3">
              <div class="col-md-4">
                <input id="task-name" placeholder="Nazwa zadania" required class="form-control" />
              </div>
              <div class="col-md-4">
                <input id="task-description" placeholder="Opis" required class="form-control" />
              </div>
              <div class="col-md-4">
                <select id="task-priority" class="form-select">
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>
              <div class="col-md-6">
                <input id="task-time" type="number" min="1" placeholder="Czas (h)" required class="form-control" />
              </div>
              <div class="col-md-6">
                <select id="task-story" class="form-select"></select>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-secondary">Dodaj</button>
              </div>
            </form>

            <!-- Estetyczna tablica Kanban -->
            <div id="task-kanban" class="row mt-5 g-4">
              <div class="col-md-4">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white fw-bold">Do zrobienia</div>
                  <div class="card-body p-2" id="kanban-todo"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark fw-bold">W trakcie</div>
                  <div class="card-body p-2" id="kanban-doing"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-success">
                  <div class="card-header bg-success text-white fw-bold">Zrobione</div>
                  <div class="card-body p-2" id="kanban-done"></div>
                </div>
              </div>
            </div>

            <div id="task-detail" class="mt-4"></div>
          </section>

          <!-- Lista użytkowników -->
          <section>
            <h2 class="h4 mb-3">Lista użytkowników (mock)</h2>
            <ul id="user-list" class="list-group">
              ${UserManager.getAllUsers()
                .map(u => `<li class="list-group-item">${u.firstName} ${u.lastName} (${u.role})</li>`)
                .join('')}
            </ul>
          </section>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-dark text-white text-center py-3">
        <small>Aplikacja stworzona przez Korneliusz Świerczek • Nr albumu: 14933</small>
      </footer>
    </div>
  `;

  renderUser();
  renderProjectSelector();
  setupProjectForm();
  renderProjects();
  setupStoryForm();
  renderStoryList();
  setupTaskForm();
  renderKanban();
  showAlert('Witaj w ManagMe!', 'info');
}
