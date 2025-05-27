import { TaskStorage } from '../storage/TaskStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { StoryStorage } from '../storage/StoryStorage';
import { renderKanban } from './taskKanban';
import type { Task } from '../models/Task';
import { renderApp } from './mainApp';

export function setupTaskForm(): void {
  const form = document.querySelector<HTMLFormElement>('#task-form')!;
  const name = document.querySelector<HTMLInputElement>('#task-name')!;
  const desc = document.querySelector<HTMLInputElement>('#task-description')!;
  const priority = document.querySelector<HTMLSelectElement>('#task-priority')!;
  const time = document.querySelector<HTMLInputElement>('#task-time')!;
  const story = document.querySelector<HTMLSelectElement>('#task-story')!;

  const activeProject = ActiveProject.get();
  if (!activeProject) {
    showAlert('Brak aktywnego projektu. Nie można dodać zadania.', 'danger');
    return;
  }

  const stories = StoryStorage.getByProject(activeProject);
  if (!stories.length) {
    showAlert('Brak historyjek w projekcie. Dodaj najpierw historyjkę.', 'warning');
    return;
  }

  // Załaduj historie do selecta
  story.innerHTML = `<option disabled selected value="">Wybierz historyjkę</option>`;
  stories.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    story.appendChild(opt);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!name.value.trim() || !desc.value.trim() || !priority.value || !time.value || !story.value) {
      showAlert('Uzupełnij wszystkie pola zadania.', 'warning');
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      name: name.value.trim(),
      description: desc.value.trim(),
      priority: priority.value as any,
      estimatedTime: Number(time.value),
      storyId: story.value,
      state: 'todo',
      createdAt: new Date().toISOString()
    };

    TaskStorage.save(task);
    form.reset();
    renderApp();
    renderKanban();
    showAlert(`Dodano zadanie "${task.name}".`, 'success');
  });
}

// Bootstrap alert helper
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
