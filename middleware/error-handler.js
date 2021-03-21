const BaseError = require('../errors/base-error');

const errorHandler = (err, req, res, next) => {
    if (err instanceof BaseError) {
        res.status(err.statusCode).send({ errors: err.serialize() });
    } else {
        // Unexpected error encountered

        console.error('Unexpected error', err);

        res.status(500).send({
            errors: [{ message: 'Unexpected error' }],
        });
    }
};

module.exports = errorHandler;