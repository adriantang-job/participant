const express = require('express');
const { param } = require('express-validator');

const validateRequest = require('../../middleware/request-validation');
const { Participant } = require('../../models/participant');
const NotFoundError = require('../../errors/not-found-error');

const router = express.Router();

router.delete('/api/v1/participants/:refNo', [
    param('refNo').notEmpty().withMessage('Reference number must be provided')
], validateRequest, async (req, res) => {
    const refNo = req.params.refNo;

    const deletedParticipant = await Participant.findOneAndDelete({ refNo }, { useFindAndModify: false });
    if (!deletedParticipant) {
        throw new NotFoundError();
    }

    res.status(204).send();
});

module.exports = router;