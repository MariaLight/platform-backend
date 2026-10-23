const express = require('express');
const router = express.Router();
const service = require('../services/courses.service');
const { asyncHandler } = require('../utils/helpers');

const pickCourse = (body) => {
    const course = {
        title: body.title,
        image_url: body.image_url ?? body.imageUrl,
        published_at: body.published_at ?? body.publishedAt,
    };

    return Object.fromEntries(
        Object.entries(course).filter(([, value]) => value !== undefined)
    );
};

router.get('/', asyncHandler(async (req, res) => {
    const courses = await service.getAllCourses();
    res.json(courses);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const course = await service.getCourseById(req.params.id);
    if (!course) {
        return res.status(404).json(null);
    }
    res.json(course);
}));

router.post('/', asyncHandler(async (req, res) => {
    const payload = pickCourse(req.body);

    if (!payload.title) {
        return res.status(400).json({ error: 'Нужно название курса' });
    }

    const created = await service.addCourse(payload);
    res.status(201).json(created);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await service.updateCourse(req.params.id, pickCourse(req.body));
    if (!updated) {
        return res.status(404).json(null);
    }
    res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const deleted = await service.deleteCourse(req.params.id);
    if (!deleted) {
        return res.status(404).json(null);
    }
    res.json({ success: true });
}));

module.exports = router;
