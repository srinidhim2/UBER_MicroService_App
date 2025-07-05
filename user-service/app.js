const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./router/user.router');
const handleErrors = require('./middlewares/error-handler');
const apiRouter = express.Router()
const cookieParser = require('cookie-parser')
const connect = require('./db/db')

connect()
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(morgan('dev'));
app.use('/api',apiRouter)
apiRouter.use('/user', userRouter);
app.get('/',(req,res)=>{
  res.json({'message':'Hello'})
})




app.use(handleErrors)
module.exports = app;