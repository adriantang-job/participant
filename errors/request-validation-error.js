const BaseError = require('./base-error');

/**
 * Request validation error represents errors when validating request parameters, body, headers, etc.
 */
class RequestValidationError extends BaseError {
    constructor(errors) {
        super('Invalid request parameters');

        this.errors = errors;
    }

    get statusCode() {
        return 400;
    }

    serialize() {
        return this.errors.map(err => ({ message: err.msg, param: err.param }));
    }
}

module.exports = RequestValidationError;