const rideModel = require('../models/ride.model');
const { subscribeToQueue, publishToQueue } = require('../service/rabbit')

module.exports.createRide = async(req,res,next)=>{
    try{
        const {pickup, destination} = req.body
        

        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        })
        const data = await newRide.save()
        publishToQueue("new-ride",JSON.stringify(newRide))
        res.status(201).send({data})
    }
    catch(error){
        next(error)
    }
}