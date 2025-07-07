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


module.exports.acceptRide = async(req,res,next)=>{
    // console.log(req.query)
    const {rideId} = req.query
    const ride = await rideModel.findById({_id:rideId})
    if(!ride){
        return res.status(404).json({'message':'Ride not found'})
    }
    ride.status = 'accepted'
    await ride.save()
    publishToQueue("ride-accepted",JSON.stringify(ride))
    res.status(201).send(ride)
}