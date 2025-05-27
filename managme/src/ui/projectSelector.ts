import { ProjectStorage } from '../storage/ProjectStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { renderProjects } from './projectList';
import { renderApp } from './mainApp';

export function renderProjectSelector(): void {
  const container = document.querySelector<HTMLDivElement>('#project-selector')!;
  const projects = ProjectStorage.getProjects();
  const activeId = ActiveProject.get();

  const select = document.createElement('select');
  select.className = 'form-select';
  select.setAttribute('aria-label', 'Wybór projektu');
  select.innerHTML = `<option disabled ${!activeId ? 'selected' : ''} value="">Wybierz projekt</option>`;

  projects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    if (project.id === activeId) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const selectedId = select.value;
    ActiveProject.set(selectedId);
    renderApp();
    renderProjects();
  });

  container.innerHTML = '';
  container.appendChild(select);
}
