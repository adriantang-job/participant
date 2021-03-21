const request = require('supertest');

const app = require('../../../app');
const { Participant } = require('../../../models/participant');

const createParticipantInDB = async doc => {
    const participant = new Participant(doc);
    await participant.save();
    return participant;
};

describe('invalid request parameters', () => {
    it('returns 404 if participant reference number not specified', async () => {
        await request(app)
            .get('/api/v1/participants')
            .send()
            .expect(404);
    });

    it('returns 404 if participant with specified reference number not found', async () => {
        await request(app)
            .get('/api/v1/participants/some-non-existing-ref')
            .send()
            .expect(404);
    });
});

describe('get participant by reference number', () => {
    it('returns the participant with an existing reference number', async () => {
        const refNo = 'KFG-734';
        const name = 'Jane Doe';
        const dateOfBirth = '1950-12-23';
        const phone = '07284937736';
        const address = '94 Tottenham Court Road, London, W1T 1JY';
        const participant = await createParticipantInDB({ refNo, name, dateOfBirth, phone, address });

        const response = await request(app)
            .get(`/api/v1/participants/${participant.refNo}`)
            .send()
            .expect(200);

        expect(response.body.refNo).toEqual(participant.refNo);
        expect(response.body.name).toEqual(participant.name);
        expect(response.body.dateOfBirth).toEqual(participant.dateOfBirth);
        expect(response.body.phone).toEqual(participant.phone);
        expect(response.body.address).toEqual(participant.address);
    });
});