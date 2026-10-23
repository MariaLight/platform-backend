CREATE DATABASE IF NOT EXISTS platform_for_courses
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE platform_for_courses;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    user_img VARCHAR(255),
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    role_id INT NOT NULL DEFAULT 4,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    `order` INT NOT NULL DEFAULT 1,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    `order` INT NOT NULL DEFAULT 1,
    content TEXT,
    video_url VARCHAR(255),
    module_id INT,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    lesson_id INT,
    user_id INT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    access_start DATE,
    access_end DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO roles (id, name) VALUES
    (1, 'Администратор'),
    (2, 'Гость'),
    (3, 'Редактор'),
    (4, 'Ученик'),
    (5, 'Куратор'),
    (6, 'Тех.поддержка')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, email, password, name, user_img, registered_at, role_id) VALUES
    (1, 'mdlight@mail.ru', '73456890', 'Мария М', 'https://i.postimg.cc/k6qGm0Mg/00e37d9128f11f0856e12e0f91208af-3.jpg', '2024-09-01', 1),
    (2, 'mdlight97@gmail.com', 'qwerty2020', 'Денис', NULL, '2025-05-09 02:51:46', 3),
    (3, 'testtest@mail.ru', 'qazxsw', NULL, NULL, '2025-05-10', 4),
    (4, 'testtest2@mail.ru', 'qazxsw', NULL, NULL, '2025-05-10', 4)
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO courses (id, title, image_url, published_at) VALUES
    (1, 'Академический курс “Математический анализ”', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', '2024-09-12'),
    (2, 'Аналитическая геометрия', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', '2024-09-12'),
    (3, 'Общая физика', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', '2024-09-12'),
    (4, 'Теория вероятности', '', '2025-05-15'),
    (5, 'Математическая статистика', '', '2025-05-15')
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO modules (id, title, image_url, `order`, course_id) VALUES
    (1, 'Модуль 1. Введение', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', 1, 1),
    (2, 'Модуль 2', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', 2, 1),
    (3, 'Модуль 3', NULL, 3, 1),
    (4, 'Модуль 4', NULL, 4, 1),
    (5, 'Введение', NULL, 1, 4)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (id, title, image_url, content, module_id, `order`, video_url) VALUES
    (1, 'Урок 1 - Вводный урок', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', 'Вводный урок по математическому анализу', 1, 1, ''),
    (2, 'Урок 2', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', 'Текст второго урока', 1, 2, ''),
    (3, 'Урок 3', 'https://i.postimg.cc/XryBKkNg/Rectangle-28.png', 'Текст третьего урока', 1, 3, ''),
    (4, 'Урок 4', NULL, 'Текст четвёртого урока', 1, 4, NULL),
    (5, 'Урок 1', NULL, 'Введение в модуль 2', 2, 1, NULL)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO user_courses (id, user_id, course_id, access_start, access_end) VALUES
    (1, 3, 1, '2024-09-01', '2025-09-01'),
    (2, 3, 2, '2024-09-01', '2025-09-01'),
    (3, 4, 1, '2024-09-01', '2025-09-01')
ON DUPLICATE KEY UPDATE course_id = VALUES(course_id);
