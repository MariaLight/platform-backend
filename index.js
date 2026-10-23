require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./db');
const usersRoutes = require('./controllers/users.controller');
const rolesRoutes = require('./controllers/roles.controller');
const coursesRoutes = require('./controllers/courses.controller');
const modulesRoutes = require('./controllers/modules.controller');
const lessonsRoutes = require('./controllers/lessons.controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/lessons', lessonsRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Такая запись уже существует' });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Связанная запись не найдена' });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(500).json({
            error: 'Схема базы данных не совпадает с API. Выполните schema.sql или migrate.sql',
        });
    }

    res.status(err.status || 500).json({ error: 'Что-то пошло не так!' });
});

db.query('SELECT 1')
    .then(() => {
        console.log('db connection success');
        app.listen(PORT, '0.0.0.0', () => console.log(`server started at ${PORT}`));
    })
    .catch((err) => console.log('db connection failed: ' + err));
