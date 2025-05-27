import { ProjectStorage } from '../storage/ProjectStorage';
import type { Project } from '../models/Project';
import { ActiveProject } from '../storage/ActiveProject';
import { renderApp } from './mainApp';

export function setupProjectForm(): void {
  const form = document.querySelector<HTMLFormElement>('#project-form')!;
  const nameInput = document.querySelector<HTMLInputElement>('#name')!;
  const descInput = document.querySelector<HTMLInputElement>('#description')!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    if (!name || !desc) {
      showAlert('Wszystkie pola projektu muszą być uzupełnione.', 'warning');
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description: desc
    };

    ProjectStorage.saveProject(newProject);
    ActiveProject.set(newProject.id);
    renderApp(); // automatycznie wywoła renderProjectSelector + renderProjects

    showAlert(`Dodano projekt "${name}"`, 'success');
    form.reset();
  });
}

// Pomocnicza funkcja - dodaj, jeśli nie masz jej globalnie
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

  setTimeout(() => {
    alert.classList.remove('show');
    alert.classList.add('hide');
    setTimeout(() => alert.remove(), 200);
  }, 5000);
}
