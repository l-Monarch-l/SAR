# SAR - lorebook

Fullstack-приложение для ведения базы знаний (лорбука) вымышленной вселенной. Позволяет создавать, просматривать и редактировать информацию о персонажах, расах, историях и статьях.

## Возможности

*   **CRUD для 4 сущностей:** Персонажи, Расы, Истории, Статьи.
*   **Связи многие-ко-многим:** персонажи ↔ истории ↔ расы ↔ статьи.
*   **Аутентификация:** JWT-токены, регистрация и логин.
*   **Ролевая модель (RBAC):** `reader` (чтение) и `admin` (полный доступ).
*   **Защита API:** `POST/PUT/DELETE` доступны только администраторам.
*   **Health-check** для мониторинга и CI/CD.
*   **Адаптивная вёрстка:** тёмная тема в стиле «системный терминал».

## Стек технологий

**Frontend:**
*   React 18
*   React Router
*   Axios (с интерцепторами для JWT)
*   Vite
*   Кастомный CSS (CSS-переменные, тёмная палитра)

**Backend:**
*   Node.js 20
*   Express
*   SQLite 3
*   JWT (`jsonwebtoken`)
*   bcryptjs (хеширование паролей)

**DevOps / Инфраструктура:**
*   Docker (multi-stage build)
*   Docker Compose
*   Nginx (раздача SPA + проксирование API)
*   Health-check контейнера

## Требования

*   Docker Desktop (Windows/macOS) или Docker + Docker Compose (Linux)
*   Свободные порты: **80** (frontend) и **3001** (backend, только для отладки)

## Запуск

### 1. Клонирование

```bash
git clone https://github.com/l-Monarch-l/SAR.git
cd SAR
```

### 2. Переменные окружения

Создайте файл `.env` в корне проекта (рядом с `docker-compose.yml`):

```dotenv
JWT_SECRET=ваш-длинный-случайный-секрет-минимум-32-символа
ADMIN_EMAIL=почта
ADMIN_PASSWORD=пароль
```

Также создайте `backend/.env` с теми же значениями:

```dotenv
JWT_SECRET=ваш-длинный-случайный-секрет-минимум-32-символа
ADMIN_EMAIL=почта
ADMIN_PASSWORD=пароль
```

> **Важно:** значения `JWT_SECRET` в обоих файлах должны совпадать. Файлы `.env` не коммитятся в репозиторий.

### 3. Запуск контейнеров

```bash
docker-compose up --build
```

Первый запуск займёт 1–2 минуты (сборка образов).

### 4. Создание администратора

После того как контейнеры запустятся, выполните:

```bash
docker exec -it sar_backend node scripts/createAdmin.js
```

Скрипт прочитает `ADMIN_EMAIL` и `ADMIN_PASSWORD` из `backend/.env` и создаст администратора.

### 5. Открытие приложения

*   **Приложение:** http://localhost
*   **API (для отладки):** http://localhost:3001/api
*   **Health-check:** http://localhost:3001/health

## Роли пользователей

| Роль | Что может |
|---|---|
| **Аноним** | Просматривать списки и детали (GET-запросы) |
| **reader** | То же, что аноним (залогинен, но без прав на изменение) |
| **admin** | Полный CRUD: создание, редактирование, удаление всех сущностей |

**Создание reader:** через страницу `/register` на фронтенде.
**Создание admin:** только через `scripts/createAdmin.js` — эндпоинт регистрации создаёт только `reader`.

## Основные эндпоинты API

### Аутентификация

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | Все | Регистрация (создаёт `reader`) |
| POST | `/api/auth/login` | Все | Логин, возвращает JWT |
| GET | `/api/auth/me` | Авторизованные | Данные текущего пользователя |

### Сущности

| Метод | Путь | Доступ |
|---|---|---|
| GET | `/api/{characters\|races\|stories\|articles}` | Все |
| GET | `/api/{...}/:id` | Все |
| POST | `/api/{...}` | Только admin |
| PUT | `/api/{...}/:id` | Только admin |
| DELETE | `/api/{...}/:id` | Только admin |

### Служебные

| Метод | Путь | Описание |
|---|---|---|
| GET | `/` | Информация о сервисе |
| GET | `/health` | Health-check для мониторинга |

Nginx проксирует запросы на `/api/*` к backend-контейнеру через внутреннюю Docker-сеть. Наружу открыт только порт `80` — это стандартная практика для продакшена.

## Структура проекта

```
SAR/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT-проверка и RBAC
│   ├── routes/
│   │   └── auth.js          # /register, /login, /me
│   ├── scripts/
│   │   └── createAdmin.js   # Создание админа из .env
│   ├── database.js          # SQLite + миграции
│   ├── server.js            # Express + все роуты
│   ├── Dockerfile
│   ├── .env                 # НЕ коммитится
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js     # Axios с интерцепторами
│   │   ├── context/         # AuthContext
│   │   ├── components/      # Navbar
│   │   └── pages/           # Все страницы
│   ├── nginx.conf           # Проксирование /api + SPA
│   ├── Dockerfile           # Multi-stage: build → nginx
│   └── package.json
├── docker-compose.yml
├── .env                     # НЕ коммитится
└── README.md
```

## Скриншоты

<details>
<summary>Показать скриншоты</summary>

  <img width="1911" height="575" alt="{5AB237C2-3F85-4BBD-89BE-7F120F4826AE}" src="https://github.com/user-attachments/assets/3306235d-1f61-4136-9930-de411bb504ad" />
  <img width="1918" height="653" alt="{AEC7825F-BA22-4E88-B0E4-72BD6ABD7ABB}" src="https://github.com/user-attachments/assets/45a7b489-64e0-47f0-bfbf-1dfa9c947ba4" />
  <img width="1919" height="570" alt="{235AC790-AFD7-4040-ABD6-422A0571F50B}" src="https://github.com/user-attachments/assets/cde61826-df07-48e6-87ae-a5c4fe360bdb" />
  <img width="1920" height="660" alt="{470EBAAE-A7FF-45B5-9901-FA7745E743DF}" src="https://github.com/user-attachments/assets/60766c1d-a47d-448d-9388-7e3dbb5180f0" />
  <img width="1907" height="667" alt="{AD96F6CF-D2D3-4F0B-89D4-264B7699A65D}" src="https://github.com/user-attachments/assets/d6f3ac15-c262-4d1d-ae90-99305ccee856" />
  <img width="1892" height="936" alt="{B20F6FAF-FD38-4445-AC0B-F6DCF9753FAE}" src="https://github.com/user-attachments/assets/eaa0a5f9-1136-46e2-8fa8-51e447f07459" />
  <img width="1765" height="939" alt="image" src="https://github.com/user-attachments/assets/d5155a5d-1bd4-4ffb-ae32-a52bd67f2e3f" />
  <img width="1911" height="939" alt="image" src="https://github.com/user-attachments/assets/6f50b13d-314c-46b2-acf9-a207b11a46bc" />
  <img width="1894" height="929" alt="image" src="https://github.com/user-attachments/assets/ee236cf5-46eb-4e7c-93de-763d60627027" />
  <img width="1918" height="667" alt="{5326DCFC-47C7-46D9-9C60-62AA6F0FF9E0}" src="https://github.com/user-attachments/assets/829f5058-2194-4c38-b7a4-d7eff024bb32" />
  <img width="1916" height="757" alt="{D64247A1-CBB4-498C-AE3D-FCBA040CFD76}" src="https://github.com/user-attachments/assets/28297d5d-ad24-4392-a264-2b1316607d59" />
  <img width="1887" height="438" alt="image" src="https://github.com/user-attachments/assets/ed285057-bb1b-45a3-bc06-f350747ae271" />

</details>

Автор: l-Monarch-l
