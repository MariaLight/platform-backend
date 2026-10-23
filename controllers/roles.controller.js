const express = require('express');
const router = express.Router();
const service = require('../services/roles.service');
const { asyncHandler } = require('../utils/helpers');

router.get('/', asyncHandler(async (req, res) => {
    const roles = await service.getAllRoles();
    res.json(roles);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const role = await service.getRoleById(req.params.id);
    if (!role) {
        return res.status(404).json(null);
    }
    res.json(role);
}));

module.exports = router;
