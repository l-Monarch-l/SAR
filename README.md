# SAR

Fullstack-приложение для ведения базы знаний (лорбука) вымышленной вселенной. Позволяет создавать, просматривать и редактировать информацию о персонажах, расах, историях и статьях.

## Стек технологий

**Frontend:**
*   React
*   React Router
*   CSS (кастомная стилизация)

**Backend:**
*   Node.js
*   SQLite (база данных)

**DevOps / Инфраструктура:**
*   Docker
*   Docker Compose

## Функционал

*   **CRUD для 4 сущностей:** Персонажи (Characters), Расы (Races), Истории (Stories), Статьи (Articles).
*   **Просмотр списков:** Удобные страницы со всеми записями.
*   **Детальные страницы:** Просмотр полной информации о каждом объекте.
*   **Формы создания и редактирования:** Валидация и отправка данных на сервер.
*   **Навигация:** Единый Navbar для перемещения между разделами.
*   **Адаптивная верстка:** Темная тема в стиле "темного фэнтези".

## Запуск проекта

Самый простой способ запустить проект — использовать Docker Compose.

1. Клонируйте репозиторий:
  ```bash
  git clone https://github.com/ваш_логин/SAR.git
  cd SAR
  ```
  Запустите контейнеры:
   
  ```bash
  docker-compose up --build
  Откройте приложение в браузере:
  ```

  <img width="1911" height="575" alt="{5AB237C2-3F85-4BBD-89BE-7F120F4826AE}" src="https://github.com/user-attachments/assets/3306235d-1f61-4136-9930-de411bb504ad" />
  <img width="1918" height="653" alt="{AEC7825F-BA22-4E88-B0E4-72BD6ABD7ABB}" src="https://github.com/user-attachments/assets/45a7b489-64e0-47f0-bfbf-1dfa9c947ba4" />
  <img width="1919" height="570" alt="{235AC790-AFD7-4040-ABD6-422A0571F50B}" src="https://github.com/user-attachments/assets/cde61826-df07-48e6-87ae-a5c4fe360bdb" />
  <img width="1920" height="660" alt="{470EBAAE-A7FF-45B5-9901-FA7745E743DF}" src="https://github.com/user-attachments/assets/60766c1d-a47d-448d-9388-7e3dbb5180f0" />
  <img width="1907" height="667" alt="{AD96F6CF-D2D3-4F0B-89D4-264B7699A65D}" src="https://github.com/user-attachments/assets/d6f3ac15-c262-4d1d-ae90-99305ccee856" />
  <img width="1892" height="936" alt="{B20F6FAF-FD38-4445-AC0B-F6DCF9753FAE}" src="https://github.com/user-attachments/assets/eaa0a5f9-1136-46e2-8fa8-51e447f07459" />
  <img width="1765" height="939" alt="image" src="https://github.com/user-attachments/assets/d5155a5d-1bd4-4ffb-ae32-a52bd67f2e3f" />
  <img width="1911" height="939" alt="image" src="https://github.com/user-attachments/assets/6f50b13d-314c-46b2-acf9-a207b11a46bc" />
  <img width="1894" height="929" alt="image" src="https://github.com/user-attachments/assets/ee236cf5-46eb-4e7c-93de-763d60627027" />

  Frontend: http://localhost:5173
  Backend API: http://localhost:3001
