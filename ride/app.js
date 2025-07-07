const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser');
const connect = require('./db/db');
connect();
const rabbitMq = require('./service/rabbit')
const handleErrors = require('./middleware/error-handler')
rabbitMq.connect();
const rideRoutes = require('./routes/ride.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', rideRoutes);

app.use(handleErrors)

module.exports = app;