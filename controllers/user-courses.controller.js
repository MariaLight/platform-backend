const express = require('express');
const router = express.Router();
const service = require('../services/user-courses.service');
const { asyncHandler } = require('../utils/helpers');

const pickUserCourse = (body) => {
    const userCourse = {
        user_id: body.user_id ?? body.userId,
        course_id: body.course_id ?? body.courseId,
        access_start: body.access_start ?? body.accessStart,
        access_end: body.access_end ?? body.accessEnd,
    };

    return Object.fromEntries(
        Object.entries(userCourse).filter(([, value]) => value !== undefined)
    );
};

router.get('/', asyncHandler(async (req, res) => {
    const userId = req.query.user_id || req.query.userId;
    const userCourses = await service.getAllUserCourses(userId);
    res.json(userCourses);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const userCourse = await service.getUserCourseById(req.params.id);
    if (!userCourse) {
        return res.status(404).json(null);
    }
    res.json(userCourse);
}));

router.post('/', asyncHandler(async (req, res) => {
    const payload = pickUserCourse(req.body);

    if (!payload.user_id || !payload.course_id) {
        return res.status(400).json({ error: 'Нужны user_id и course_id' });
    }

    const created = await service.addUserCourse(payload);
    res.status(201).json(created);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await service.updateUserCourse(req.params.id, pickUserCourse(req.body));
    if (!updated) {
        return res.status(404).json(null);
    }
    res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const deleted = await service.deleteUserCourse(req.params.id);
    if (!deleted) {
        return res.status(404).json(null);
    }
    res.json({ success: true });
}));

module.exports = router;
