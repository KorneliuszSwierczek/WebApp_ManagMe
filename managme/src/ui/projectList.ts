import { ProjectStorage } from '../storage/ProjectStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { renderProjectSelector } from './projectSelector';

export function renderProjects(): void {
  const list = document.querySelector<HTMLUListElement>('#project-list')!;
  list.innerHTML = '';

  const activeId = ActiveProject.get();
  const project = ProjectStorage.getProjects().find(p => p.id === activeId);

  if (!project) {
    list.innerHTML = '<li class="list-group-item text-muted fst-italic">Brak aktywnego projektu lub projekt został usunięty</li>';
    return;
  }

  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';

  const info = document.createElement('div');
  info.innerHTML = `<strong>${project.name}</strong>: ${project.description}`;
  li.appendChild(info);

  const btn = document.createElement('button');
  btn.textContent = 'Usuń projekt';
  btn.className = 'btn btn-sm btn-danger';
  btn.onclick = () => {
    ProjectStorage.deleteProject(project.id);
    ActiveProject.clear();
    renderProjectSelector();
    renderProjects();
    showAlert(`Projekt "${project.name}" został usunięty.`, 'warning');
  };

  li.appendChild(btn);
  list.appendChild(li);
}

// Można przenieść do globalnych helpers jeśli często używane
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
