/// <reference types="cypress" />
describe('Logowanie do ManagMe', () => {
  const baseUrl = 'http://localhost:5173'; // zmień jeśli inny port

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('powinno zalogować poprawnego użytkownika (Jan)', () => {
    cy.get('#login').type('jan');
    cy.get('#password').type('123');
    cy.get('form#login-form').submit();

    // Sprawdź, czy aplikacja się załadowała
    cy.contains('ManagMe – System zarządzania projektami').should('be.visible');
    cy.get('#user-info').should('contain', 'Jan Kowalski');
  });

  it('powinno pokazać błąd przy niepoprawnym logowaniu', () => {
    cy.get('#login').type('nieistniejacy');
    cy.get('#password').type('zlehaslo');
    cy.get('form#login-form').submit();

    cy.get('#login-error')
      .should('be.visible')
      .and('contain', 'Niepoprawny login lub hasło');
  });
});
/// <reference types="cypress" />
describe('ManagMe – logowanie i operacje CRUD oraz usuwanie kolejno elementów', () => {
  const baseUrl = 'http://localhost:5173';

  const projekt = {
    nazwa: 'Testowy projekt',
    opis: 'Projekt testowy do e2e'
  };

  const story = {
    nazwa: 'Testowa historyjka',
    opis: 'Opis historyjki',
    priorytet: 'medium'
  };

  const task = {
    nazwa: 'Zadanie testowe',
    opis: 'Opis zadania testowego',
    czas: '4',
    priorytet: 'high'
  };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('tworzy i usuwa projekt, historyjkę oraz zadanie', () => {
    // Logowanie jako admin
    cy.get('#login').type('jan');
    cy.get('#password').type('123');
    cy.get('form#login-form').submit();

    // Dodawanie projektu
    cy.get('#name').type(projekt.nazwa);
    cy.get('#description').type(projekt.opis);
    cy.get('#project-form').submit();

    cy.get('#project-list')
      .should('contain', projekt.nazwa)
      .and('contain', projekt.opis);

    // Dodawanie historyjki
    cy.get('#story-name').type(story.nazwa);
    cy.get('#story-description').type(story.opis);
    cy.get('#story-priority').select(story.priorytet);
    cy.get('#story-form').submit();

    cy.get('#story-list')
      .should('contain', story.nazwa)
      .and('contain', story.opis);

    // Dodawanie zadania
    cy.get('#task-name').type(task.nazwa);
    cy.get('#task-description').type(task.opis);
    cy.get('#task-priority').select(task.priorytet);
    cy.get('#task-time').type(task.czas);
    cy.get('#task-story option:not([disabled])').should('have.length.greaterThan', 0);
    cy.get('#task-story').select(1);
    cy.get('#task-form').submit();

    cy.get('#kanban-todo')
      .should('contain', task.nazwa)
      .and('contain', task.opis);

    // === USUWANIE ===


    it('Usuwa zadanie', () => {
    cy.get('#kanban-done .btn-outline-info').first().click();
    cy.contains('button', 'Usuń').click();
    cy.wait(500); // Na render
    cy.get('#kanban-done').should('not.contain', task.nazwa);
  });

  it('Usuwa historyjkę', () => {
    cy.get('#story-list [data-action="delete"]').first().click();
    cy.wait(500);
    cy.get('#story-list').should('not.contain', story.nazwa);
  });

  it('Usuwa projekt', () => {
    cy.contains('#project-list li', projekt.nazwa).within(() => {
      cy.contains('button', 'Usuń projekt').click();
    });
    cy.wait(500);
    cy.get('#project-list').should('not.contain', projekt.nazwa);});

  });
});


/// <reference types="cypress" />
describe('ManagMe – pełen przepływ: projekt → zadanie → przypisanie → zmiana statusu', () => {
  const baseUrl = 'http://localhost:5173';

  const projekt = {
    nazwa: 'Projekt E2E Cypress',
    opis: 'Opis projektu E2E'
  };

  const story = {
    nazwa: 'Historyjka E2E',
    opis: 'Opis historyjki',
    priorytet: 'medium'
  };

  const task = {
    nazwa: 'Zadanie E2E',
    opis: 'Opis zadania',
    czas: '2',
    priorytet: 'low'
  };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('Admin tworzy projekt, historyjkę, zadanie, przypisuje Annę; Anna kończy zadanie', () => {
    // Logowanie jako admin
    cy.get('#login').type('jan');
    cy.get('#password').type('123');
    cy.get('form#login-form').submit();

    // Dodanie projektu
    cy.get('#name').type(projekt.nazwa);
    cy.get('#description').type(projekt.opis);
    cy.get('#project-form').submit();

    cy.get('#project-list')
      .should('contain', projekt.nazwa)
      .and('contain', projekt.opis);

    // Dodanie historyjki
    cy.get('#story-name').type(story.nazwa);
    cy.get('#story-description').type(story.opis);
    cy.get('#story-priority').select(story.priorytet);
    cy.get('#story-form').submit();

    cy.get('#story-list')
      .should('contain', story.nazwa)
      .and('contain', story.opis);

    // Dodanie zadania
    cy.get('#task-name').type(task.nazwa);
    cy.get('#task-description').type(task.opis);
    cy.get('#task-priority').select(task.priorytet);
    cy.get('#task-time').type(task.czas);
    cy.get('#task-story option:not([disabled])').should('have.length.greaterThan', 0);
    cy.get('#task-story').select(1);
    cy.get('#task-form').submit();

    // Sprawdzenie, czy zadanie jest na tablicy Kanban
    cy.get('#kanban-todo')
      .should('contain', task.nazwa)
      .and('contain', task.opis);

    // Przejście do szczegółów zadania
    cy.get('#task-kanban .btn-outline-info').first().click();

    // Poczekaj na pojawienie się użytkowników w dropdownie
    cy.get('#assign-user option').should('contain.text', 'Anna Nowak');

    // Przypisanie Anny
    cy.get('#assign-user').select('Anna Nowak');
    cy.get('#assign-task').click();

    // Wylogowanie
    cy.get('#logout-btn').click();

    // Logowanie jako Anna
    cy.get('#login').type('anna');
    cy.get('#password').type('123');
    cy.get('form#login-form').submit();

    // Przejście do szczegółów przypisanego zadania
    cy.get('#task-kanban .btn-outline-info').first().click();

    // Zmiana statusu na "Zakończone"
    cy.get('#mark-done').click();

    // Sprawdzenie, czy zadanie jest w kolumnie "Zakończone"
    cy.get('#kanban-done')
      .should('contain', task.nazwa)
      .and('contain', task.opis);
  });
});

