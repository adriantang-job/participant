const BaseError = require('./base-error');

/**
 * Not found error represents a resource is not found.
 */
class NotFoundError extends BaseError {
    constructor() {
        super('Not found');
    }

    get statusCode() {
        return 404;
    }

    serialize() {
        return [{ message: 'Resource not found' }];
    }
}

module.exports = NotFoundError;