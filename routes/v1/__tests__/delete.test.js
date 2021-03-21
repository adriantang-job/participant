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
            .delete('/api/v1/participants')
            .send()
            .expect(404);
    });

    it('returns 404 if participant with specified reference number not found', async () => {
        await request(app)
            .delete('/api/v1/participants/some-non-existing-ref')
            .send()
            .expect(404);
    });
});

describe('remove participant by reference number', () => {
    it('removes the participants with specified reference numbers and returns 204', async () => {
        let refNo = 'KFG-734';
        let name = 'Jane Doe';
        let dateOfBirth = '1950-12-23';
        let phone = '07284937736';
        let address = '94 Tottenham Court Road, London, W1T 1JY';
        const participant1 = await createParticipantInDB({ refNo, name, dateOfBirth, phone, address });

        refNo = 'ABC-123';
        name = 'John Doe';
        dateOfBirth = '1980-02-05';
        phone = '07688932637';
        address = '87 Tottenham Court Road, London, W1T 1JY';
        const participant2 = await createParticipantInDB({ refNo, name, dateOfBirth, phone, address });

        await request(app)
            .delete(`/api/v1/participants/${participant1.refNo}`)
            .send()
            .expect(204);

        const remainingParticipants = await Participant.find({});
        expect(remainingParticipants.length).toEqual(1);
        expect(remainingParticipants[0].refNo).toEqual(participant2.refNo);
        expect(remainingParticipants[0].name).toEqual(participant2.name);
        expect(remainingParticipants[0].dateOfBirth).toEqual(participant2.dateOfBirth);
        expect(remainingParticipants[0].phone).toEqual(participant2.phone);
        expect(remainingParticipants[0].address).toEqual(participant2.address);
    });
});