import { ProjectStorage } from '../storage/ProjectStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { renderProjectSelector } from './projectSelector';

export function renderProjects(): void {
  const list = document.querySelector<HTMLUListElement>('#project-list')!;
  list.innerHTML = '';

  const activeId = ActiveProject.get();
  const project = ProjectStorage.getProjects().find(p => p.id === activeId);

  if (!project) {
    list.innerHTML = '<li>Brak aktywnego projektu lub projekt został usunięty</li>';
    return;
  }

  const li = document.createElement('li');
  li.textContent = `${project.name}: ${project.description}`;

  const btn = document.createElement('button');
  btn.textContent = 'Usuń projekt';
  btn.style.marginLeft = '1rem';
  btn.onclick = () => {
    ProjectStorage.deleteProject(project.id);
    ActiveProject.clear();
    renderProjectSelector();
    renderProjects();
  };

  li.appendChild(btn);
  list.appendChild(li);
}
