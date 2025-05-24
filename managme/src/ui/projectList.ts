import { ProjectStorage } from '../storage/ProjectStorage';

export function renderProjects(): void {
  const list = document.querySelector<HTMLUListElement>('#project-list')!;
  list.innerHTML = '';

  const projects = ProjectStorage.getProjects();
  for (const p of projects) {
    const li = document.createElement('li');
    li.textContent = `${p.name}: ${p.description}`;

    const btn = document.createElement('button');
    btn.textContent = 'Usuń';
    btn.onclick = () => {
      ProjectStorage.deleteProject(p.id);
      renderProjects();
    };

    li.appendChild(btn);
    list.appendChild(li);
  }
}
