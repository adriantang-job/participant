const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

const startMongoDB = async () => {
    if (mongo) {
        await stopMongoDB();
    }

    try {
        mongo = new MongoMemoryServer();
        const mongoUri = await mongo.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.info('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

const stopMongoDB = async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();

    console.info('MongoDB closed');
}

module.exports = { startMongoDB, stopMongoDB };
