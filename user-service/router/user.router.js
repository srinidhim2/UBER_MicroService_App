const express = require('express');
const authMiddleware = require('../middlewares/authMiddleWare')
const userRouter = express.Router();
const userController = require('../controller/user.controller')

userRouter.get('/',(req,res,next)=>{
    res.json({"message":"Welcome user"})
})

userRouter.post('/register', userController.register)
userRouter.post('/login',userController.login)
userRouter.post('/logout',userController.logout)
userRouter.get('/profile', authMiddleware.userAuth, userController.profile);
// userRouter.get('/accepted-ride',authMiddleware.userAuth, userController.acceptedRide);

module.exports = userRouter