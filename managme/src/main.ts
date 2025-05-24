import './style.css';
import { setupProjectForm } from './ui/projectForm';
import { renderProjects } from './ui/projectList';
import { UserManager } from './storage/UserManager';
import { renderUser } from './ui/userDisplay';
import { renderProjectSelector } from './ui/projectSelector';
import { setupStoryForm } from './ui/storyForm';
import { renderStoryList } from './ui/storyList';

document.addEventListener('DOMContentLoaded', () => {
  UserManager.setMockUser();

  const app = document.querySelector<HTMLDivElement>('#app')!;
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
  `;

  renderUser();
  renderProjectSelector();
  setupProjectForm();
  renderProjects();
  setupStoryForm();
  renderStoryList();
});
