const mongoose = require('mongoose');
const { startMongoDB, stopMongoDB } = require('../db');

beforeAll(async () => {
    await startMongoDB();
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await stopMongoDB();
});