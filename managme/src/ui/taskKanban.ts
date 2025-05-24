import { TaskStorage } from '../storage/TaskStorage';
import { StoryStorage } from '../storage/StoryStorage';
import { UserManager } from '../storage/UserManager';
import type { Task, TaskState } from '../models/Task';

export function renderKanban(): void {
  const container = document.querySelector<HTMLDivElement>('#task-kanban')!;
  container.innerHTML = '';

  const grouped: Record<TaskState, Task[]> = {
    todo: [],
    doing: [],
    done: []
  };

  for (const task of TaskStorage.getAll()) {
    grouped[task.state].push(task);
  }

  (['todo', 'doing', 'done'] as TaskState[]).forEach(state => {
    const col = document.createElement('div');
    col.style.border = '1px solid gray';
    col.style.padding = '1rem';
    col.style.margin = '1rem';
    col.style.flex = '1';
    col.innerHTML = `<h3>${state.toUpperCase()}</h3>`;

    grouped[state].forEach(task => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.style.borderBottom = '1px dashed #aaa';
      div.innerHTML = `
        <strong>${task.name}</strong><br/>
        ${task.description}<br/>
        Priorytet: ${task.priority}<br/>
        <button data-id="${task.id}">Szczegóły</button>
      `;
      div.querySelector('button')!.onclick = () => renderTaskDetail(task.id);
      col.appendChild(div);
    });

    container.appendChild(col);
  });
}

function renderTaskDetail(taskId: string) {
  const task = TaskStorage.getById(taskId);
  if (!task) return alert('Nie znaleziono zadania');

  const detail = document.querySelector<HTMLDivElement>('#task-detail')!;
  const story = StoryStorage.getById(task.storyId);
  const user = task.assignedUserId ? UserManager.getAllUsers().find(u => u.id === task.assignedUserId) : null;

  detail.innerHTML = `
    <h3>Szczegóły zadania</h3>
    <p><strong>${task.name}</strong> (${task.priority})</p>
    <p>${task.description}</p>
    <p>Story: ${story?.name}</p>
    <p>Status: ${task.state}</p>
    <p>Przewidywany czas: ${task.estimatedTime}h</p>
    <p>Data startu: ${task.startedAt ?? '-'}</p>
    <p>Data zakończenia: ${task.finishedAt ?? '-'}</p>
    <p>Przypisany użytkownik: ${user ? user.firstName + ' ' + user.lastName : '-'}</p>

    ${task.state === 'todo' ? renderAssignForm(task) : ''}
    ${task.state === 'doing' ? '<button id="mark-done">Oznacz jako wykonane</button>' : ''}
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
    <label>Przypisz osobę:
      <select id="assign-user">
        ${users.map(u => `<option value="${u.id}">${u.firstName} ${u.lastName}</option>`).join('')}
      </select>
    </label>
    <button id="assign-task">Przypisz</button>
  `;
}

document.addEventListener('click', (e) => {
  const btn = e.target as HTMLElement;
  if (btn.id === 'assign-task') {
    const select = document.querySelector<HTMLSelectElement>('#assign-user')!;
    const taskId = TaskStorage.getAll().find(t => !t.assignedUserId)?.id;
    if (!taskId) return;

    const task = TaskStorage.getById(taskId);
    if (!task) return;

    task.assignedUserId = select.value;
    task.state = 'doing';
    task.startedAt = new Date().toISOString();
    TaskStorage.update(task);

    renderKanban();
    document.querySelector<HTMLDivElement>('#task-detail')!.innerHTML = '';
  }
});
