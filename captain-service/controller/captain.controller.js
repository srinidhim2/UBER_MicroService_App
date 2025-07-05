const Captain = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi')
const HttpError = require('../utils/httpError')
const blacklisttokenModel = require('../models/blacklisttoken.model')

const validateCaptain = (captain)=>{
    const captainSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    })
    const result = captainSchema.validate(captain)
    return result
}

module.exports.register = async (req, res, next) => {
    try{
        const result = validateCaptain(req.body)
        if(result.error){
            throw new HttpError(result.error.details[0].message,400)
        }
        const {name,email,password} = req.body
        const isExist = await Captain.isExist(email)
        if(isExist){
            throw new HttpError('Captain with email already exist',409)
        }
        const hash = await bcrypt.hash(password,10)
        const captain = await Captain({name,email,password:hash})
        const newCaptain = await captain.save(captain)
        const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token',token)
        return res.status(201).send({newCaptain})
    }
    catch(error){
        next(error)
    }
}

module.exports.login = async (req, res,next) => {
    try {
        const { email, password } = req.body;
        const captain = await Captain
            .findOne({ email })
            .select('+password');
        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, captain.password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        delete captain._doc.password;
        res.cookie('token', token);
        res.send({ token, captain });
    } catch (error) {
        next(error)
    }

}

module.exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
        if (!token) {
            return res.status(400).json({ message: 'No token found in cookies. Captain may already be logged out.' });
        }
        await blacklisttokenModel.create({ token });
        res.clearCookie('token');
        res.send({ message: 'Captain logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.send(req.captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.toggleAvailability= async (req,res,next)=>{
    try{
        const captain = await Captain.findById({_id:req.captain._id})
        if(!captain)
            throw new Error('Captain not found',404)
        captain.isAvailable = !captain.isAvailable
        const newCaptain = await captain.save()
        res.status(201).send({details:newCaptain})

    }
    catch(error){
        next(error)
    }
}