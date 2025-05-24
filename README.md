ManagMe – System Zarządzania Projektami

ManagMe to nowoczesna, lekka aplikacja webowa typu SPA do zarządzania projektami, napisana z wykorzystaniem Vue 3 (Vite + TypeScript) oraz Node.js + Express (TypeScript). Aplikacja umożliwia zarządzanie projektami, historyjkami (user stories), zadaniami oraz uwierzytelnianie użytkowników z użyciem tokenów JWT.

Funkcjonalności

Projekty:

- Tworzenie projektów

- Lista projektów i aktywny projekt

- Zapisywanie danych w localStorage

Historyjki (Funkcjonalności):

- Tworzenie historyjek w ramach aktywnego projektu

- Podział wg statusu: todo, doing, done

Zadania:

- Przypisanie zadania do historyjki

- Przypisanie osoby (developer/devops)

- Automatyczna zmiana statusu i daty przy przypisaniu lub zakończeniu

- Widok tablicy Kanban (todo, doing, done)

Uwierzytelnianie:

- Logowanie za pomocą loginu i hasła

- Weryfikacja JWT z backendu

- Obsługa accessToken oraz refreshToken

- Endpoint /api/me pobierający dane zalogowanego użytkownika

Technologie

Frontend:

- Vue 3 + Vite

- TypeScript

- CSS

- localStorage do przechowywania projektów, zadań i tokenów JWT

Backend:

- Node.js + Express

- TypeScript

- jsonwebtoken do obsługi JWT

- cors, body-parser

Uruchomienie projektu

1. Klonowanie repozytorium

git clone https://github.com/KorneliuszSwierczek/WebApp_ManagMe.git
cd managme

2. Instalacja frontend

cd managme
npm install
npm run dev

3. Instalacja backend

cd ../managme-api
npm install
npx ts-node-dev index.ts

API Backend (Express)

POST /api/login

Body: { login, password }

Response: { accessToken, refreshToken }

POST /api/refresh

Body: { token }

Response: { accessToken }

GET /api/me

Header: Authorization: Bearer <accessToken>

Response: dane zalogowanego użytkownika (bez hasła)