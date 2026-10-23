const express = require('express');
const router = express.Router();
const service = require('../services/lessons.service');
const { asyncHandler } = require('../utils/helpers');

const pickLesson = (body) => {
    const lesson = {
        title: body.title,
        image_url: body.image_url ?? body.imageUrl,
        order: body.order,
        content: body.content,
        video_url: body.video_url ?? body.videoUrl,
        module_id: body.module_id ?? body.moduleId,
    };

    return Object.fromEntries(
        Object.entries(lesson).filter(([, value]) => value !== undefined)
    );
};

router.get('/', asyncHandler(async (req, res) => {
    const moduleId = req.query.module_id || req.query.moduleId;
    const lessons = await service.getAllLessons(moduleId);
    res.json(lessons);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const lesson = await service.getLessonById(req.params.id);
    if (!lesson) {
        return res.status(404).json(null);
    }
    res.json(lesson);
}));

router.post('/', asyncHandler(async (req, res) => {
    const payload = pickLesson(req.body);

    if (!payload.title || !payload.module_id) {
        return res.status(400).json({ error: 'Нужны title и module_id' });
    }

    const created = await service.addLesson(payload);
    res.status(201).json(created);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await service.updateLesson(req.params.id, pickLesson(req.body));
    if (!updated) {
        return res.status(404).json(null);
    }
    res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const deleted = await service.deleteLesson(req.params.id);
    if (!deleted) {
        return res.status(404).json(null);
    }
    res.json({ success: true });
}));

module.exports = router;
