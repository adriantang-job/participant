const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    refNo: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret._id;
            delete ret.__v;
        },
    },
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = { Participant };