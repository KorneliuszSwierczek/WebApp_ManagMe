import { ActiveProject } from '../storage/ActiveProject';
import { StoryStorage } from '../storage/StoryStorage';
import { UserManager } from '../storage/UserManager';
import type { Story, StoryStatus } from '../models/Story';

export function renderStoryList(): void {
  const list = document.querySelector<HTMLDivElement>('#story-list')!;
  list.innerHTML = '';

  const user = UserManager.getUser();
  const projectId = ActiveProject.get();

  if (!projectId || !user) {
    list.innerHTML = '<div class="alert alert-info">Brak danych do wyświetlenia.</div>';
    return;
  }

  const stories = StoryStorage.getByProject(projectId);

  const grouped: Record<StoryStatus, Story[]> = {
    todo: [],
    doing: [],
    done: [],
  };

  for (const story of stories) {
    grouped[story.status].push(story);
  }

  const statusLabels: Record<StoryStatus, string> = {
    todo: 'Do zrobienia',
    doing: 'W trakcie',
    done: 'Zakończone',
  };

  (['todo', 'doing', 'done'] as StoryStatus[]).forEach((status) => {
    const section = document.createElement('div');
    section.className = 'mb-4';

    section.innerHTML = `<h4 class="mb-3 text-capitalize">${statusLabels[status]}</h4>`;

    grouped[status].forEach((story) => {
      const card = document.createElement('div');
      card.className = 'card mb-2 shadow-sm';

      const adminButtons = user.role === 'admin'
        ? `
          <button class="btn btn-outline-danger btn-sm me-2" data-action="delete" data-id="${story.id}">Usuń</button>
          ${renderChangeStatusButton(story.status, story.id)}
          <button class="btn btn-outline-secondary btn-sm ms-2" data-action="edit" data-id="${story.id}">Edytuj</button>
        `
        : '';

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title mb-1">${story.name} 
            <span class="badge bg-${getPriorityColor(story.priority)} text-uppercase ms-2">${story.priority}</span>
          </h5>
          <p class="card-text small mb-2">${story.description}</p>
          <p class="card-text text-muted mb-2"><em>Właściciel: ${user.firstName} ${user.lastName}</em></p>
          ${adminButtons}
        </div>
      `;

      if (user.role === 'admin') {
        card.querySelector('[data-action="delete"]')!.addEventListener('click', () => {
          StoryStorage.delete(story.id);
          renderStoryList();
          showAlert(`Usunięto historyjkę "${story.name}".`, 'warning');
        });

        const changeBtn = card.querySelector('[data-action="change-status"]');
        if (changeBtn) {
          changeBtn.addEventListener('click', () => {
            const nextStatus = getNextStatus(story.status);
            if (nextStatus) {
              story.status = nextStatus;
              StoryStorage.update(story);
              renderStoryList();
              showAlert(`Zmieniono status historyjki na "${statusLabels[nextStatus]}".`, 'info');
            }
          });
        }

        const editBtn = card.querySelector('[data-action="edit"]');
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            renderEditForm(story);
          });
        }
      }

      section.appendChild(card);
    });

    list.appendChild(section);
  });
}

function renderEditForm(story: Story): void {
  const list = document.querySelector<HTMLDivElement>('#story-list')!;
  list.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'card shadow-sm p-3';

  form.innerHTML = `
    <h5 class="card-title mb-3">Edytuj historyjkę</h5>
    <div class="mb-3">
      <label for="edit-story-name" class="form-label">Nazwa</label>
      <input type="text" class="form-control" id="edit-story-name" value="${story.name}" required>
    </div>
    <div class="mb-3">
      <label for="edit-story-desc" class="form-label">Opis</label>
      <textarea class="form-control" id="edit-story-desc" rows="3" required>${story.description}</textarea>
    </div>
    <div class="mb-3">
      <label for="edit-story-priority" class="form-label">Priorytet</label>
      <select class="form-select" id="edit-story-priority">
        <option value="low" ${story.priority === 'low' ? 'selected' : ''}>Niski</option>
        <option value="medium" ${story.priority === 'medium' ? 'selected' : ''}>Średni</option>
        <option value="high" ${story.priority === 'high' ? 'selected' : ''}>Wysoki</option>
      </select>
    </div>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-success btn-sm">Zapisz</button>
      <button type="button" class="btn btn-secondary btn-sm" id="cancel-edit">Anuluj</button>
    </div>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (form.querySelector('#edit-story-name') as HTMLInputElement).value.trim();
    const description = (form.querySelector('#edit-story-desc') as HTMLTextAreaElement).value.trim();
    const priority = (form.querySelector('#edit-story-priority') as HTMLSelectElement).value as 'low' | 'medium' | 'high';

    const updated: Story = { ...story, name, description, priority };
    StoryStorage.update(updated);
    renderStoryList();
    showAlert('Zaktualizowano historyjkę.', 'success');
  });

  form.querySelector('#cancel-edit')!.addEventListener('click', () => {
    renderStoryList();
  });

  list.appendChild(form);
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low': return 'secondary';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    default: return 'primary';
  }
}

function renderChangeStatusButton(current: StoryStatus, id: string): string {
  const next = getNextStatus(current);
  if (!next) return '';
  return `<button class="btn btn-outline-primary btn-sm" data-action="change-status" data-id="${id}">Zmień status</button>`;
}

function getNextStatus(current: StoryStatus): StoryStatus | null {
  switch (current) {
    case 'todo': return 'doing';
    case 'doing': return 'done';
    case 'done': return null;
  }
}

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