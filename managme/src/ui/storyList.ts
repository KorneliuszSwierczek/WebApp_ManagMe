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
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title mb-1">${story.name} 
            <span class="badge bg-${getPriorityColor(story.priority)} text-uppercase ms-2">${story.priority}</span>
          </h5>
          <p class="card-text small mb-2">${story.description}</p>
          <p class="card-text text-muted mb-2"><em>Właściciel: ${user.firstName} ${user.lastName}</em></p>
          <button class="btn btn-outline-danger btn-sm" data-id="${story.id}">Usuń</button>
        </div>
      `;

      card.querySelector('button')!.onclick = () => {
        StoryStorage.delete(story.id);
        renderStoryList();
        showAlert(`Usunięto historyjkę "${story.name}".`, 'warning');
      };

      section.appendChild(card);
    });

    list.appendChild(section);
  });
}

// Klasy Bootstrapowe do kolorowania priorytetu
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low': return 'secondary';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    default: return 'primary';
  }
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
