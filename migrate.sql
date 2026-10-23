-- Для уже созданной БД из отчёта: добавить поля, которые нужны фронту.
USE platform_for_courses;

ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS published_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE user_courses
    ADD COLUMN IF NOT EXISTS access_start DATE NULL;

ALTER TABLE user_courses
    ADD COLUMN IF NOT EXISTS access_end DATE NULL;
