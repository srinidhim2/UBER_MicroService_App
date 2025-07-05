const express = require('express')
const expressProxy = require('express-http-proxy')
const dotenv = require('dotenv')
const app = express()
dotenv.config()


app.use('/user', expressProxy(`http://${process.env.SERVER}:${process.env.USER_SERVICE_PORT}`))
app.use('/captain', expressProxy(`http://${process.env.SERVER}:${process.env.CAPTAIN_SERVICE_PORT}`))

app.listen(process.env.GATEWAY_PORT,console.log(`Gateway server is running on ${process.env.GATEWAY_PORT}`))