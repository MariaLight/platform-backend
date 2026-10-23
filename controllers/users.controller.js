const express = require('express');
const router = express.Router();
const service = require('../services/users.service');
const { asyncHandler } = require('../utils/helpers');

const pickUser = (body, isCreate = false) => {
    const user = {
        email: body.email,
        password: body.password,
        name: body.name,
        user_img: body.user_img ?? body.userImg,
        registered_at: body.registered_at ?? body.registeredAt,
        role_id: body.role_id ?? body.roleId,
    };

    if (isCreate) {
        user.name = user.name ?? null;
        user.user_img = user.user_img ?? null;
        user.role_id = user.role_id ?? 4;
    }

    return Object.fromEntries(
        Object.entries(user).filter(([, value]) => value !== undefined)
    );
};

router.get('/', asyncHandler(async (req, res) => {
    const users = await service.getAllUsers(req.query.email);
    res.json(users);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const user = await service.getUserById(req.params.id);
    if (!user) {
        return res.status(404).json(null);
    }
    res.json(user);
}));

router.post('/', asyncHandler(async (req, res) => {
    const payload = pickUser(req.body, true);

    if (!payload.email || !payload.password) {
        return res.status(400).json({ error: 'Нужны email и password' });
    }

    const created = await service.addUser(payload);
    res.status(201).json(created);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await service.updateUser(req.params.id, pickUser(req.body));
    if (!updated) {
        return res.status(404).json(null);
    }
    res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const deleted = await service.deleteUser(req.params.id);
    if (!deleted) {
        return res.status(404).json(null);
    }
    res.json({ success: true });
}));

module.exports = router;
