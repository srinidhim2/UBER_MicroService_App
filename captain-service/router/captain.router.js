const express = require('express');
const authMiddleware = require('../middlewares/authMiddleWare')
const captainRouter = express.Router();
const captainController = require('../controller/captain.controller')

captainRouter.get('/',(req,res,next)=>{
    res.json({"message":"Welcome captain"})
})

captainRouter.post('/register', captainController.register)
captainRouter.post('/login',captainController.login)
captainRouter.post('/logout',captainController.logout)
captainRouter.get('/profile', authMiddleware.captainAuth, captainController.profile);
// captainRouter.get('/accepted-ride',authMiddleware.captainAuth, captainController.acceptedRide);
captainRouter.patch('/toggleAvailability',authMiddleware.captainAuth,captainController.toggleAvailability)
module.exports = captainRouter