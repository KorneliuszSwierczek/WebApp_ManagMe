import { ProjectStorage } from '../storage/ProjectStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { renderProjectSelector } from './projectSelector';
import { UserManager } from '../storage/UserManager'; 


function getCurrentUserRole(): 'admin' | 'devops' | 'developer' | null {
  const user = UserManager.getUser();
  return user?.role ?? null;
}

export function renderProjects(): void {
  const list = document.querySelector<HTMLDivElement>('#project-list')!;
  list.innerHTML = '';

  const activeId = ActiveProject.get();
  const project = ProjectStorage.getProjects().find(p => p.id === activeId);

  if (!project) {
    list.innerHTML =
      '<div class="alert alert-info fst-italic">Brak aktywnego projektu lub projekt został usunięty.</div>';
    return;
  }

  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title mb-2';
  title.textContent = project.name;

  const desc = document.createElement('p');
  desc.className = 'card-text text-muted mb-3';
  desc.textContent = project.description;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'd-flex gap-2';

  const role = getCurrentUserRole();

  if (role === 'admin') {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edytuj';
    editBtn.className = 'btn btn-sm btn-outline-primary';
    editBtn.onclick = () => renderEditForm(project);
    btnGroup.appendChild(editBtn);
  }

  if (role === 'admin' || role === 'devops') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Usuń';
    deleteBtn.className = 'btn btn-sm btn-danger';
    deleteBtn.onclick = () => {
      ProjectStorage.deleteProject(project.id);
      ActiveProject.clear();
      renderProjectSelector();
      renderProjects();
      showAlert(`Projekt "${project.name}" został usunięty.`, 'warning');
    };
    btnGroup.appendChild(deleteBtn);
  }

  body.appendChild(title);
  body.appendChild(desc);
  if (btnGroup.children.length > 0) body.appendChild(btnGroup);
  card.appendChild(body);
  list.appendChild(card);
}

//formularza edycji (tylko dla admina)
function renderEditForm(project: { id: string; name: string; description: string }) {
  const list = document.querySelector<HTMLDivElement>('#project-list')!;
  list.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'card shadow-sm p-3';

  form.innerHTML = `
    <h5 class="card-title mb-3">Edytuj projekt</h5>
    <div class="mb-3">
      <label for="edit-project-name" class="form-label">Nazwa</label>
      <input type="text" class="form-control" id="edit-project-name" value="${project.name}">
    </div>
    <div class="mb-3">
      <label for="edit-project-desc" class="form-label">Opis</label>
      <textarea class="form-control" id="edit-project-desc" rows="3">${project.description}</textarea>
    </div>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-success btn-sm">Zapisz</button>
      <button type="button" class="btn btn-secondary btn-sm" id="cancel-edit">Anuluj</button>
    </div>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (form.querySelector('#edit-project-name') as HTMLInputElement).value.trim();
    const description = (form.querySelector('#edit-project-desc') as HTMLTextAreaElement).value.trim();
    if (!name) return showAlert('Nazwa nie może być pusta.', 'danger');

    const updated = { ...project, name, description };
    ProjectStorage.updateProject(updated);
    renderProjectSelector();
    renderProjects();
    showAlert('Zaktualizowano projekt.', 'success');
  });

  form.querySelector('#cancel-edit')!.addEventListener('click', () => {
    renderProjects();
  });

  list.appendChild(form);
}

//alerty
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
