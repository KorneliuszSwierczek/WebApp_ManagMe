import { ProjectStorage } from '../storage/ProjectStorage';
import type { Project } from '../models/Project';
import { renderProjects } from './projectList';
import { ActiveProject } from '../storage/ActiveProject';
import { renderProjectSelector } from './projectSelector';

export function setupProjectForm(): void {
  const form = document.querySelector<HTMLFormElement>('#project-form')!;
  const nameInput = document.querySelector<HTMLInputElement>('#name')!;
  const descInput = document.querySelector<HTMLInputElement>('#description')!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: nameInput.value.trim(),
      description: descInput.value.trim()
    };
    ProjectStorage.saveProject(newProject);

    ActiveProject.set(newProject.id);

    renderProjectSelector();
    renderProjects();

    form.reset();
  });
}
