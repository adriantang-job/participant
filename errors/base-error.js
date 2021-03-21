/**
 * Abstract base class for an application error
 */
class BaseError extends Error {
    constructor(message) {
        super(message);
    }

    get statusCode() {
        throw new TypeError('Implementing statusCode() is required');
    }

    serialize() {
        throw new TypeError('Implementing serialize() is required');
    }
}

module.exports = BaseError;