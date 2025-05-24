import { setupProjectForm } from './projectForm';
import { renderProjects } from './projectList';
import { renderUser } from './userDisplay';
import { renderProjectSelector } from './projectSelector';
import { setupStoryForm } from './storyForm';
import { renderStoryList } from './storyList';
import { setupTaskForm } from './taskForm';
import { renderKanban } from './taskKanban';
import { UserManager } from '../storage/UserManager';

export function renderApp(): void {
  const user = UserManager.getUser();
  const app = document.querySelector<HTMLDivElement>('#app')!;
  if (!user) return;

  app.innerHTML = `
    <div id="user-info" style="margin-bottom: 1rem;"></div>
    <div id="project-selector" style="margin-bottom: 1rem;"></div>

    <h1>ManagMe – Zarządzanie projektami</h1>
    <form id="project-form">
      <input id="name" placeholder="Nazwa projektu" required />
      <input id="description" placeholder="Opis projektu" required />
      <button type="submit">Dodaj projekt</button>
    </form>

    <ul id="project-list"></ul>

    <hr/>

    <h2>Historyjki projektu</h2>
    <form id="story-form">
      <input id="story-name" placeholder="Nazwa historyjki" required />
      <input id="story-description" placeholder="Opis" required />
      <select id="story-priority">
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>
      <button type="submit">Dodaj historyjkę</button>
    </form>

    <div id="story-list" style="margin-top: 1rem;"></div>

    <hr/>

    <h2>Dodaj zadanie</h2>
    <form id="task-form">
      <input id="task-name" placeholder="Nazwa zadania" required />
      <input id="task-description" placeholder="Opis" required />
      <select id="task-priority">
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>
      <input id="task-time" type="number" min="1" placeholder="Przewidywany czas (h)" required />
      <select id="task-story"></select>
      <button type="submit">Dodaj</button>
    </form>

    <div id="task-kanban" style="display: flex; gap: 1rem; margin-top: 1rem;"></div>
    <div id="task-detail" style="margin-top: 2rem;"></div>

    <hr/>

    <h2>Lista użytkowników (mock)</h2>
    <ul id="user-list">
      ${UserManager.getAllUsers()
        .map(u => `<li>${u.firstName} ${u.lastName} (${u.role})</li>`)
        .join('')}
    </ul>
  `;

  renderUser();
  renderProjectSelector();
  setupProjectForm();
  renderProjects();
  setupStoryForm();
  renderStoryList();
  setupTaskForm();
  renderKanban();
}
