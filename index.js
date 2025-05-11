const express = require('express'), app = express();

const db = require('./db'),
    usersRoutes = require('./controllers/users.controller')

// middleware 
app.use('/api/users', usersRoutes)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status||500).send('Что-то пошло не так!');
})
db.query('SELECT 1')
    .then(connection => {
        console.log('db connection success')

        app.listen(3000, () => console.log('server started at 3000'))
    })
    .catch(err => console.log('db connection failed' + err));
