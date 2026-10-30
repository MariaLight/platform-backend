# platform-backend

REST API платформы онлайн-обучения. Контракт совместим с клиентским BFF: те же ресурсы, что у json-server, с префиксом `/api`.

## Запуск

1. Создайте базу и таблицы:

```bash
mysql -u platform_user -p < schema.sql
```

Если таблицы уже созданы по отчёту, можно не гонять schema.sql заново.
Для колонок дат и тестовых учёток:

```bash
npm run seed
```

(или `node seed.js` — там и migrate, и юзеры из ридми)

2. Скопируйте `.env.example` в `.env` и укажите данные MySQL.

3. Установите зависимости и запустите сервер:

```bash
npm i
npm start
```

API будет доступно на `http://localhost:3000`. Проверка: `GET http://localhost:3000/api/health`.

## Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/roles` | Список ролей |
| GET | `/api/users` | Все пользователи |
| GET | `/api/users?email=` | Поиск по email (массив, как у json-server) |
| GET | `/api/users/:id` | Пользователь |
| POST | `/api/users` | Регистрация |
| PATCH | `/api/users/:id` | Обновление |
| DELETE | `/api/users/:id` | Удаление |
| GET/POST/PATCH/DELETE | `/api/courses` | Курсы |
| GET | `/api/modules?course_id=` | Модули курса |
| GET/POST/PATCH/DELETE | `/api/modules` | Модули |
| GET | `/api/lessons?module_id=` | Уроки модуля |
| GET/POST/PATCH/DELETE | `/api/lessons` | Уроки |
| GET | `/api/user_courses?user_id=` | Курсы ученика |
| POST/PATCH/DELETE | `/api/user_courses` | Назначение курса |

Тестовые учётки после `schema.sql`:

- администратор: `mdlight@mail.ru` / `73456890`
- редактор: `mdlight97@gmail.com` / `qwerty2020`
- ученик: `testtest@mail.ru` / `qazxsw`

## Хостинг (Render + Aiven)

API крутится на Render Web Service, база — Aiven MySQL.

На Render в Environment:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — из Aiven
- `DB_SSL=true`
- `CORS_ORIGIN=*` (пока нет своего сайта)
- `NODE_VERSION=20`
- `PORT` не задавать

Build: `npm install`. Start: `npm start`. Ветка: `master`.

Проверка: `https://<имя>.onrender.com/api/health`
