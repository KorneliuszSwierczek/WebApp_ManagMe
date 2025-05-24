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
    list.innerHTML = 'Brak danych do wyświetlenia.';
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

  (['todo', 'doing', 'done'] as StoryStatus[]).forEach((status) => {
    const section = document.createElement('div');
    section.innerHTML = `<h3>${status.toUpperCase()}</h3>`;

    grouped[status].forEach((story) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${story.name}</strong> (${story.priority})<br/>
        <small>${story.description}</small><br/>
        <em>Właściciel: ${user.firstName} ${user.lastName}</em><br/>
        <button data-id="${story.id}">Usuń</button>
      `;
      div.querySelector('button')!.onclick = () => {
        StoryStorage.delete(story.id);
        renderStoryList();
      };
      section.appendChild(div);
    });

    list.appendChild(section);
  });
}
