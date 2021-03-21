const express = require('express');
const { param } = require('express-validator');

const validateRequest = require('../../middleware/request-validation');
const { Participant } = require('../../models/participant');
const NotFoundError = require('../../errors/not-found-error');

const router = express.Router();

router.get('/api/v1/participants/:refNo', [
    param('refNo').notEmpty().withMessage('Reference number must be provided')
], validateRequest, async (req, res) => {
    const refNo = req.params.refNo;

    const participant = await Participant.findOne({ refNo });
    if (!participant) {
        throw new NotFoundError();
    }

    res.send(participant);
});

module.exports = router;