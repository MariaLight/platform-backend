const express = require('express'),
    router = express.Router();

const service = require('..//services/users.service')

router.get('/', async (req, res) => {
    const users = await service.getAllUsers();
    res.send(users)
})
router.get('/:id', async (req, res) => {
    const user = await service.getUserById(req.params.id);
    if (user.length == 0) {
        res.status(404).json('Такого пользователя нет ' + req.params.id)
    } else {
        res.send(user)
    }
})
router.delete('/:id', async (req, res) => {
    const affectedRows = await service.deleteUser(req.params.id);
    if (affectedRows.length == 0) {
        res.status(404).json('Такого пользователя нет ' + req.params.id)
    } else {
        res.send('successfully deleted')
    }
})

module.exports = router;