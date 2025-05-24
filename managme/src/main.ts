import './style.css';
import { setupProjectForm } from './ui/projectForm';
import { renderProjects } from './ui/projectList';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
    <h1>ManagMe – Zarządzanie projektami</h1>
    <form id="project-form">
      <input id="name" placeholder="Nazwa projektu" required />
      <input id="description" placeholder="Opis projektu" required />
      <button type="submit">Dodaj projekt</button>
    </form>

    <ul id="project-list"></ul>
  `;

  setupProjectForm();
  renderProjects();
});
