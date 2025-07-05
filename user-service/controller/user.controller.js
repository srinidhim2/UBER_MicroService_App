const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi')
const HttpError = require('../utils/httpError')
const blacklisttokenModel = require('../models/blacklisttoken.model')

const validateUser = (user)=>{
    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    })
    const result = userSchema.validate(user)
    return result
}

module.exports.register = async (req, res, next) => {
    try{
        const result = validateUser(req.body)
        if(result.error){
            throw new HttpError(result.error.details[0].message,400)
        }
        const {name,email,password} = req.body
        const isExist = await User.isExist(email)
        if(isExist){
            throw new HttpError('User with email already exist',409)
        }
        const hash = await bcrypt.hash(password,10)
        const user = await User({name,email,password:hash})
        const newUser = await user.save(user)
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token',token)
        return res.status(201).send({newUser})
    }
    catch(error){
        next(error)
    }
}

module.exports.login = async (req, res,next) => {
    try {
        const { email, password } = req.body;
        const user = await User
            .findOne({ email })
            .select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        delete user._doc.password;
        res.cookie('token', token);
        res.send({ token, user });
    } catch (error) {
        next(error)
    }

}

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklisttokenModel.create({ token });
        res.clearCookie('token');
        res.send({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}