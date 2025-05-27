import { TaskStorage } from '../storage/TaskStorage';
import { StoryStorage } from '../storage/StoryStorage';
import { UserManager } from '../storage/UserManager';
import type { Task, TaskState } from '../models/Task';
import { ActiveProject } from '../storage/ActiveProject';

export function renderKanban(): void {
  const container = document.querySelector<HTMLDivElement>('#task-kanban');
  if (!container) return;
  container.innerHTML = '';

  const grouped: Record<TaskState, Task[]> = {
    todo: [], doing: [], done: []
  };

  const activeProjectId = ActiveProject.get();
  if (!activeProjectId) return;

  for (const task of TaskStorage.getAll()) {
    const story = StoryStorage.getById(task.storyId);
    if (story?.projectId === activeProjectId) {
      grouped[task.state].push(task);
    }
  }

  const stateLabels: Record<TaskState, string> = {
    todo: 'Do zrobienia',
    doing: 'W trakcie',
    done: 'Zakończone'
  };

  const colors: Record<TaskState, string> = {
    todo: 'primary',
    doing: 'warning',
    done: 'success'
  };

  (['todo', 'doing', 'done'] as TaskState[]).forEach(state => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card border-${colors[state]} h-100">
        <div class="card-header bg-${colors[state]} text-white fw-bold">${stateLabels[state]}</div>
        <div class="card-body p-2" id="kanban-${state}"></div>
      </div>
    `;
    container.appendChild(col);

    const inner = col.querySelector(`#kanban-${state}`)!;

    grouped[state].forEach(task => {
      const taskCard = document.createElement('div');
      taskCard.className = 'card mb-2 shadow-sm';
      taskCard.innerHTML = `
        <div class="card-body">
          <h5 class="card-title mb-1">${task.name} 
            <span class="badge bg-${getPriorityColor(task.priority)} text-uppercase ms-2">${task.priority}</span>
          </h5>
          <p class="card-text small">${task.description}</p>
          <button class="btn btn-outline-info btn-sm me-2" data-id="${task.id}">Szczegóły</button>
          <button class="btn btn-outline-danger btn-sm" data-id="${task.id}" data-action="delete">Usuń</button>
        </div>
      `;

      taskCard.querySelector('[data-id][data-action="delete"]')?.addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
          TaskStorage.delete(task.id);
          renderKanban();
          const detail = document.querySelector<HTMLDivElement>('#task-detail');
          if (detail) detail.innerHTML = '';
          showAlert(`Zadanie "${task.name}" zostało usunięte.`, 'warning');
        }
      });

      taskCard.querySelector('[data-id]:not([data-action])')?.addEventListener('click', () => {
        renderTaskDetail(task.id);
      });

      inner.appendChild(taskCard);
    });
  });
}

function renderTaskDetail(taskId: string) {
  const task = TaskStorage.getById(taskId);
  if (!task) return alert('Nie znaleziono zadania');

  const detail = document.querySelector<HTMLDivElement>('#task-detail');
  if (!detail) return;

  const story = StoryStorage.getById(task.storyId);
  const user = task.assignedUserId ? UserManager.getAllUsers().find(u => u.id === task.assignedUserId) : null;

  detail.innerHTML = `
    <div class="card shadow mt-4">
      <div class="card-header bg-light fw-bold">Szczegóły zadania</div>
      <div class="card-body">
        <h5 class="card-title">${task.name}</h5>
        <p class="card-text">${task.description}</p>
        <p><strong>Priorytet:</strong> ${task.priority}</p>
        <p><strong>Story:</strong> ${story?.name}</p>
        <p><strong>Status:</strong> ${task.state}</p>
        <p><strong>Przewidywany czas:</strong> ${task.estimatedTime}h</p>
        <p><strong>Data startu:</strong> ${task.startedAt ?? '-'}</p>
        <p><strong>Data zakończenia:</strong> ${task.finishedAt ?? '-'}</p>
        <p><strong>Przypisany użytkownik:</strong> ${user ? user.firstName + ' ' + user.lastName : '-'}</p>
        ${task.state === 'todo' ? renderAssignForm(task) : ''}
        ${task.state === 'doing' ? `<button id="mark-done" class="btn btn-success mt-2" data-id="${task.id}">Oznacz jako wykonane</button>` : ''}
      </div>
    </div>
  `;

  if (task.state === 'doing') {
    detail.querySelector('#mark-done')?.addEventListener('click', () => {
      task.state = 'done';
      task.finishedAt = new Date().toISOString();
      TaskStorage.update(task);
      renderKanban();
      detail.innerHTML = '';
    });
  }
}

function renderAssignForm(task: Task): string {
  const users = UserManager.getAllUsers().filter(u => u.role !== 'admin');
  return `
    <div class="mt-3">
      <label for="assign-user" class="form-label">Przypisz osobę:</label>
      <select id="assign-user" class="form-select">
        ${users.map(u => `<option value="${u.id}">${u.firstName} ${u.lastName}</option>`).join('')}
      </select>
      <button id="assign-task" data-task-id="${task.id}" class="btn btn-primary mt-2">Przypisz</button>
    </div>
  `;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low': return 'secondary';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    default: return 'primary';
  }
}

// Obsługa przypisania osoby
document.addEventListener('click', (e) => {
  const btn = e.target as HTMLElement;
  if (btn.id === 'assign-task') {
    const taskId = btn.getAttribute('data-task-id');
    const select = document.querySelector<HTMLSelectElement>('#assign-user');
    if (!taskId || !select) return;

    const task = TaskStorage.getById(taskId);
    if (!task) return;

    task.assignedUserId = select.value;
    task.state = 'doing';
    task.startedAt = new Date().toISOString();
    TaskStorage.update(task);

    renderKanban();
    const detail = document.querySelector<HTMLDivElement>('#task-detail');
    if (detail) detail.innerHTML = '';

    const user = UserManager.getAllUsers().find(u => u.id === task.assignedUserId);
    if (user) {
      showAlert(`Zadanie "${task.name}" przypisano do ${user.firstName} ${user.lastName}`, 'info');
    }
  }
});

// Alert Bootstrap helper
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
