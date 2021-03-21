const request = require('supertest');

const app = require('../../../app');

const createParticipantObject = (refNo, name, dateOfBirth, phone, address) => {
    return { refNo, name, dateOfBirth, phone, address };
};

describe('invalid request body', () => {
    it('tests invalid refNo', async () => {
        let participant = createParticipantObject(undefined, 'Jane Doe', '1950-12-23',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('', 'Jane Doe', '1950-12-23',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);
    });

    it('tests invalid name', async () => {
        let participant = createParticipantObject('KFG-734', undefined, '1950-12-23',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', '', '1950-12-23',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);
    });

    it('tests invalid date of birth', async () => {
        let participant = createParticipantObject('KFG-734', 'Jane Doe', undefined,
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '1950/12/01',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-13-01',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-02-30',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-2-3',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);
    });

    it('tests invalid phone', async () => {
        let participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-12-23',
            undefined, '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-12-23',
            '', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);
    });

    it('tests invalid address', async () => {
        let participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-12-23',
            '07284937736', undefined);
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);

        participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-12-23',
            '07284937736', '');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(400);
    });
});

describe('reference number already exists', () => {
    it('returns 409 when reference number already exists', async () => {
        let participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-12-23',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant);

        participant = createParticipantObject('KFG-734', 'John Doe', '1923-04-12',
            '07284337768', '86 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(409);
    });
});

describe('participant created successfully', () => {
    it('returns 201 when a new participant is created successfully', async () => {
        let participant = createParticipantObject('KFG-734', 'Jane Doe', '1950-12-23',
            '07284937736', '94 Tottenham Court Road, London, W1T 1JY');
        await request(app)
            .post('/api/v1/participants')
            .send(participant)
            .expect(201);
    });
});