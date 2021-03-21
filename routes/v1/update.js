const express = require('express');
const { param, body } = require('express-validator');

const validateRequest = require('../../middleware/request-validation');
const { Participant } = require('../../models/participant');
const NotFoundError = require('../../errors/not-found-error');

const router = express.Router();

router.patch('/api/v1/participants/:originalRefNo', [
    param('originalRefNo').notEmpty().withMessage('Reference number must be provided'),
    body('refNo').optional().notEmpty().withMessage('refNo is required')
        .isString().withMessage('refNo must be a string'),
    body('name').optional().notEmpty().withMessage('name is required')
        .isString().withMessage('name must be a string'),
    body('dateOfBirth').optional().notEmpty().withMessage('dateOfBirth is required')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('dateOfBirth must be in format YYYY-MM-DD'),
    body('phone').optional().notEmpty().withMessage('phone is required')
        .isString().withMessage('phone must be a string'),
    body('address').optional().notEmpty().withMessage('address is required')
        .isString().withMessage('address must be a string'),
], validateRequest, async (req, res) => {
    const originalRefNo = req.params.originalRefNo;
    const newRefNo = req.body.refNo;
    const { name, dateOfBirth, phone, address } = req.body;

    const updatedParticipant = await Participant.findOneAndUpdate({ refNo: originalRefNo },
        { refNo: newRefNo, name, dateOfBirth, phone, address }, { new: true, omitUndefined: true, useFindAndModify: false });
    if (!updatedParticipant) {
        throw new NotFoundError();
    }

    res.status(200).send(updatedParticipant);
});

module.exports = router;