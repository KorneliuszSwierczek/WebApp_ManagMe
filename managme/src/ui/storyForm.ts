import { StoryStorage } from '../storage/StoryStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { renderStoryList } from './storyList';
import { UserManager } from '../storage/UserManager';
import type { Story } from '../models/Story';
import { renderApp } from './mainApp';

export function setupStoryForm(): void {
  const form = document.querySelector<HTMLFormElement>('#story-form')!;
  const name = document.querySelector<HTMLInputElement>('#story-name')!;
  const desc = document.querySelector<HTMLInputElement>('#story-description')!;
  const priority = document.querySelector<HTMLSelectElement>('#story-priority')!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = UserManager.getUser();
    const projectId = ActiveProject.get();

    if (!user || !projectId) {
      showAlert('Nie można dodać historyjki: brak aktywnego użytkownika lub projektu.', 'danger');
      return;
    }

    // ✅ Sprawdzenie roli
    const role = user.role;
    if (role !== 'admin' && role !== 'devops') {
      showAlert('Tylko administrator lub devops może dodawać historyjki.', 'danger');
      return;
    }

    if (!name.value.trim() || !desc.value.trim()) {
      showAlert('Uzupełnij wszystkie pola historyjki.', 'warning');
      return;
    }

    const story: Story = {
      id: crypto.randomUUID(),
      name: name.value.trim(),
      description: desc.value.trim(),
      priority: priority.value as any,
      status: 'todo',
      projectId,
      createdAt: new Date().toISOString(),
      ownerId: user.id,
    };

    StoryStorage.save(story);
    renderStoryList();
    form.reset();
    renderApp();
    showAlert(`Dodano historyjkę "${story.name}"`, 'success');
  });
}

// Alert Bootstrap
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
