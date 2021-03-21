const BaseError = require('./base-error');

/**
 * Conflict error represents an error when there is a conflict in resource or data. eg. ID already exists
 */
class ConflictError extends BaseError {
    constructor(message) {
        super('Resource / data conflict');

        this.message = message;
    }

    get statusCode() {
        return 409;
    }

    serialize() {
        return [{ message: this.message }];
    }
}

module.exports = ConflictError;