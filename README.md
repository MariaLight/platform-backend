# platform-backend

REST API платформы онлайн-обучения. Контракт совместим с клиентским BFF: те же ресурсы, что у json-server, с префиксом `/api`.

## Запуск

1. Создайте базу и таблицы:

```bash
mysql -u platform_user -p < schema.sql
```

Если таблицы уже созданы по отчёту, дополнительно выполните `migrate.sql` — он добавит `published_at` у курсов и даты доступа у `user_courses`.

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
