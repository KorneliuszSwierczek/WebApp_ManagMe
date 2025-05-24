import { TaskStorage } from '../storage/TaskStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { StoryStorage } from '../storage/StoryStorage';
import { renderKanban } from './taskKanban';
import type { Task } from '../models/Task';

export function setupTaskForm(): void {
  const form = document.querySelector<HTMLFormElement>('#task-form')!;
  const name = document.querySelector<HTMLInputElement>('#task-name')!;
  const desc = document.querySelector<HTMLInputElement>('#task-description')!;
  const priority = document.querySelector<HTMLSelectElement>('#task-priority')!;
  const time = document.querySelector<HTMLInputElement>('#task-time')!;
  const story = document.querySelector<HTMLSelectElement>('#task-story')!;

  const activeProject = ActiveProject.get();
  const stories = StoryStorage.getByProject(activeProject!);

  stories.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    story.appendChild(opt);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task: Task = {
      id: crypto.randomUUID(),
      name: name.value.trim(),
      description: desc.value.trim(),
      priority: priority.value as any,
      estimatedTime: Number(time.value),
      storyId: story.value,
      state: 'todo',
      createdAt: new Date().toISOString()
    };

    TaskStorage.save(task);
    form.reset();
    renderKanban();
  });
}
