const express = require('express');
const router = express.Router();
const service = require('../services/modules.service');
const { asyncHandler } = require('../utils/helpers');

const pickModule = (body) => {
    const moduleItem = {
        title: body.title,
        image_url: body.image_url ?? body.imageUrl,
        order: body.order,
        course_id: body.course_id ?? body.courseId,
    };

    return Object.fromEntries(
        Object.entries(moduleItem).filter(([, value]) => value !== undefined)
    );
};

router.get('/', asyncHandler(async (req, res) => {
    const courseId = req.query.course_id || req.query.courseId;
    const modules = await service.getAllModules(courseId);
    res.json(modules);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const moduleItem = await service.getModuleById(req.params.id);
    if (!moduleItem) {
        return res.status(404).json(null);
    }
    res.json(moduleItem);
}));

router.post('/', asyncHandler(async (req, res) => {
    const payload = pickModule(req.body);

    if (!payload.title || !payload.course_id) {
        return res.status(400).json({ error: 'Нужны title и course_id' });
    }

    const created = await service.addModule(payload);
    res.status(201).json(created);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await service.updateModule(req.params.id, pickModule(req.body));
    if (!updated) {
        return res.status(404).json(null);
    }
    res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const deleted = await service.deleteModule(req.params.id);
    if (!deleted) {
        return res.status(404).json(null);
    }
    res.json({ success: true });
}));

module.exports = router;
