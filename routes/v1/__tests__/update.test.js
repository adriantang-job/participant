const request = require('supertest');

const app = require('../../../app');
const { Participant } = require('../../../models/participant');

const createParticipantInDB = async doc => {
    const participant = new Participant(doc);
    await participant.save();
    return participant;
};

const createSampleParticipantDoc = () => {
    const refNo = 'KFG-734';
    const name = 'Jane Doe';
    const dateOfBirth = '1950-12-23';
    const phone = '07284937736';
    const address = '94 Tottenham Court Road, London, W1T 1JY';

    const obj = { refNo, name, dateOfBirth, phone, address };
    return obj;
};

describe('invalid request parameters', () => {
    it('returns 404 if participant reference number not specified', async () => {
        await request(app)
            .patch('/api/v1/participants')
            .send(createSampleParticipantDoc())
            .expect(404);
    });

    it('returns 404 if participant with specified reference number not found', async () => {
        await request(app)
            .patch('/api/v1/participants/some-non-existing-ref')
            .send(createSampleParticipantDoc())
            .expect(404);
    });

    it('tests invalid refNo', async () => {
        const participantDoc = createSampleParticipantDoc();
        await createParticipantInDB(participantDoc);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ refNo: '' })
            .expect(400);
    });

    it('tests invalid name', async () => {
        const participantDoc = createSampleParticipantDoc();
        await createParticipantInDB(participantDoc);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ name: '' })
            .expect(400);
    });

    it('tests invalid date of birth', async () => {
        const participantDoc = createSampleParticipantDoc();
        await createParticipantInDB(participantDoc);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ dateOfBirth: '' })
            .expect(400);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ dateOfBirth: '1950/12/01' })
            .expect(400);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ dateOfBirth: '1950-13-01' })
            .expect(400);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ dateOfBirth: '1950-02-30' })
            .expect(400);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ dateOfBirth: '1950-2-3' })
            .expect(400);
    });

    it('tests invalid phone', async () => {
        const participantDoc = createSampleParticipantDoc();
        await createParticipantInDB(participantDoc);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ phone: '' })
            .expect(400);
    });

    it('tests invalid address', async () => {
        const participantDoc = createSampleParticipantDoc();
        await createParticipantInDB(participantDoc);

        await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send({ address: '' })
            .expect(400);
    });
});

describe('update participant by reference number', () => {
    const assert = async (update, expected, createNew = true, deleteAfter = true) => {
        const participantDoc = createSampleParticipantDoc();

        if (createNew) {
            await createParticipantInDB(participantDoc);
        }

        const expectedUpdatedDoc = expected || Object.assign({ ...participantDoc }, update);
        let response = await request(app)
            .patch(`/api/v1/participants/${participantDoc.refNo}`)
            .send(update)
            .expect(200);
        expect(response.body).toEqual(expectedUpdatedDoc);
        const participantInDB = (await Participant.findOne({ refNo: expectedUpdatedDoc.refNo })).toJSON();
        expect(participantInDB).toEqual(expectedUpdatedDoc);

        if (deleteAfter) {
            await Participant.findOneAndDelete(
                { refNo: expectedUpdatedDoc.refNo }, { useFindAndModify: false });
        }
    };

    it('updates the participant with specified reference number and returns 200', async () => {
        await assert({});
        await assert({ someNonExistingProp: 'hello' }, createSampleParticipantDoc());
        await assert({ name: 'John Doe' });
        await assert({ dateOfBirth: '1930-05-25' });
        await assert({ phone: '07583922384' });
        await assert({ address: '75 Tottenham Court Road, London, W1T 1JY' });
        await assert({ name: 'John Doe', address: '75 Tottenham Court Road, London, W1T 1JY' });

        const newRefNo = 'ABC-123';
        await assert({ refNo: newRefNo });
        expect(await Participant.findOne({ refNo: newRefNo })).toBeDefined();
        expect(await Participant.findOne({ refNo: createSampleParticipantDoc().refNo })).toBeFalsy();
    });

    it('updates the participant twice', async () => {
        const updatedName = 'John Doe';
        const updatedDateOfBirth = '1930-05-25';

        await assert({ name: updatedName }, undefined, true, false);
        const expected = Object.assign(createSampleParticipantDoc(), { name: updatedName, dateOfBirth: updatedDateOfBirth });
        await assert({ dateOfBirth: updatedDateOfBirth }, expected, false, true);
    });
});