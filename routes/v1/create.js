const express = require('express');
const { body } = require('express-validator');

const validateRequest = require('../../middleware/request-validation');
const { Participant } = require('../../models/participant');
const ConflictError = require('../../errors/conflict-error');

const router = express.Router();

router.post('/api/v1/participants', [
    body('refNo').notEmpty().withMessage('refNo is required')
        .isString().withMessage('refNo must be a string'),
    body('name').notEmpty().withMessage('name is required')
        .isString().withMessage('name must be a string'),
    body('dateOfBirth').notEmpty().withMessage('dateOfBirth is required')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('dateOfBirth must be in the format of YYYY-MM-DD'),
    body('phone').notEmpty().withMessage('phone is required')
        .isString().withMessage('phone must be a string'),
    body('address').notEmpty().withMessage('address is required')
        .isString().withMessage('address must be a string'),
], validateRequest, async (req, res) => {
    const { refNo, name, dateOfBirth, phone, address } = req.body;

    const participantExists = await Participant.exists({ refNo });
    if (participantExists) {
        throw new ConflictError('Participant reference number already exists. It must be unique.');
    }

    const participant = new Participant({ refNo, name, dateOfBirth, phone, address });
    await participant.save();

    res.status(201).send(participant);
});

module.exports = router;