const express = require('express')
const expressProxy = require('express-http-proxy')
const dotenv = require('dotenv')
const app = express()
dotenv.config()


app.use('/user', expressProxy(`http://${process.env.USER_SERVER}:${process.env.USER_SERVICE_PORT}`))
app.use('/captain', expressProxy(`http://${process.env.CAPTAIN_SERVER}:${process.env.CAPTAIN_SERVICE_PORT}`))
app.use('/ride', expressProxy(`http://${process.env.RIDE_SERVER}:${process.env.RIDE_SERVICE_PORT}`))

app.listen(process.env.GATEWAY_PORT,console.log(`Gateway server is running on ${process.env.GATEWAY_PORT}`))