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
    <div class="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen p-8 rounded shadow-lg">
      <div id="user-info" class="mb-4"></div>
      <div id="project-selector" class="mb-4"></div>

      <h1 class="text-3xl font-bold mb-6">ManagMe – Zarządzanie projektami</h1>

      <form id="project-form" class="mb-6 space-y-2">
        <input id="name" placeholder="Nazwa projektu" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <input id="description" placeholder="Opis projektu" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Dodaj projekt</button>
      </form>

      <ul id="project-list" class="mb-6 space-y-2"></ul>

      <hr class="my-6 border-gray-300 dark:border-gray-600"/>

      <h2 class="text-2xl font-semibold mb-4">Historyjki projektu</h2>
      <form id="story-form" class="mb-6 space-y-2">
        <input id="story-name" placeholder="Nazwa historyjki" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <input id="story-description" placeholder="Opis" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <select id="story-priority" class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Dodaj historyjkę</button>
      </form>

      <div id="story-list" class="mb-8"></div>

      <hr class="my-6 border-gray-300 dark:border-gray-600"/>

      <h2 class="text-2xl font-semibold mb-4">Dodaj zadanie</h2>
      <form id="task-form" class="mb-6 space-y-2">
        <input id="task-name" placeholder="Nazwa zadania" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <input id="task-description" placeholder="Opis" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <select id="task-priority" class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
        <input id="task-time" type="number" min="1" placeholder="Przewidywany czas (h)" required class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white" />
        <select id="task-story" class="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"></select>
        <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Dodaj</button>
      </form>

      <div id="task-kanban" class="flex gap-4 flex-wrap mb-8"></div>
      <div id="task-detail" class="mb-8"></div>

      <hr class="my-6 border-gray-300 dark:border-gray-600"/>

      <h2 class="text-2xl font-semibold mb-4">Lista użytkowników (mock)</h2>
      <ul id="user-list" class="list-disc pl-6 space-y-1">
        ${UserManager.getAllUsers()
          .map(u => `<li>${u.firstName} ${u.lastName} (${u.role})</li>`)
          .join('')}
      </ul>
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
}
