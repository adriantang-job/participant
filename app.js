const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('express-async-errors');

const errorHandler = require('./middleware/error-handler');
const NotFoundError = require('./errors/not-found-error');
const createParticipantRoute = require('./routes/v1/create');
const retrieveParticipantRoute = require('./routes/v1/retrieve');
const deleteParticipantRoute = require('./routes/v1/delete');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(createParticipantRoute);
app.use(retrieveParticipantRoute);
app.use(deleteParticipantRoute);

app.all('*', (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

module.exports = app;
