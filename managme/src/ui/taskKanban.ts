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
    todo: [],
    doing: [],
    done: []
  };

  const activeProjectId = ActiveProject.get();
  if (!activeProjectId) return;

  for (const task of TaskStorage.getAll()) {
    const story = StoryStorage.getById(task.storyId);
    if (story?.projectId === activeProjectId) {
      grouped[task.state].push(task);
    }
  }

  (['todo', 'doing', 'done'] as TaskState[]).forEach(state => {
    const col = document.createElement('div');
    col.className = 'border p-4 m-4 flex-1 bg-gray-50 dark:bg-gray-800 rounded';
    col.innerHTML = `<h3 class="text-xl font-semibold mb-4">${state.toUpperCase()}</h3>`;

    grouped[state].forEach(task => {
      const div = document.createElement('div');
      div.className = 'transition-opacity duration-300 opacity-0 mb-4 border-b border-gray-300 pb-2';
      setTimeout(() => div.classList.add('opacity-100'), 10);

      div.innerHTML = `
        <strong>${task.name}</strong><br/>
        ${task.description}<br/>
        Priorytet: ${task.priority}<br/>
        <button class="details-btn bg-blue-600 text-white px-2 py-1 rounded mt-2" data-id="${task.id}">Szczegóły</button>
        <button class="delete-btn bg-red-600 text-white px-2 py-1 rounded ml-2 mt-2" data-id="${task.id}">Usuń</button>
      `;

      div.querySelector('.details-btn')?.addEventListener('click', () => renderTaskDetail(task.id));

      div.querySelector('.delete-btn')?.addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
          TaskStorage.delete(task.id);
          renderKanban();
          const detail = document.querySelector<HTMLDivElement>('#task-detail');
          if (detail) detail.innerHTML = '';
        }
      });

      col.appendChild(div);
    });

    container.appendChild(col);
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
    <h3 class="text-lg font-bold">Szczegóły zadania</h3>
    <p><strong>${task.name}</strong> (${task.priority})</p>
    <p>${task.description}</p>
    <p>Story: ${story?.name}</p>
    <p>Status: ${task.state}</p>
    <p>Przewidywany czas: ${task.estimatedTime}h</p>
    <p>Data startu: ${task.startedAt ?? '-'}</p>
    <p>Data zakończenia: ${task.finishedAt ?? '-'}</p>
    <p>Przypisany użytkownik: ${user ? user.firstName + ' ' + user.lastName : '-'}</p>

    ${task.state === 'todo' ? renderAssignForm(task) : ''}
    ${task.state === 'doing' ? `<button id="mark-done" data-id="${task.id}" class="mt-2 bg-green-600 text-white px-3 py-1 rounded">Oznacz jako wykonane</button>` : ''}
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
    <label class="block mt-2">Przypisz osobę:
      <select id="assign-user" class="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
        ${users.map(u => `<option value="${u.id}">${u.firstName} ${u.lastName}</option>`).join('')}
      </select>
    </label>
    <button id="assign-task" data-task-id="${task.id}" class="mt-2 bg-purple-600 text-white px-3 py-1 rounded">Przypisz</button>
  `;
}

// globalne nasłuchiwanie na przypisanie osoby
document.addEventListener('click', (e) => {
  const btn = e.target as HTMLElement;
  if (btn.id === 'assign-task') {
    const taskId = btn.getAttribute('data-task-id');
    if (!taskId) return;

    const select = document.querySelector<HTMLSelectElement>('#assign-user');
    if (!select) return;

    const task = TaskStorage.getById(taskId);
    if (!task) return;

    task.assignedUserId = select.value;
    task.state = 'doing';
    task.startedAt = new Date().toISOString();
    TaskStorage.update(task);

    renderKanban();
    const detail = document.querySelector<HTMLDivElement>('#task-detail');
    if (detail) detail.innerHTML = '';
  }
});
