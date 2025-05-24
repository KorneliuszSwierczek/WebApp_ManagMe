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

    if (!user || !projectId) return;

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
  });
}
