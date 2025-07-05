const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
    },
    password: {
        type: String,
        required: true,
        },
  isAvailable:{
    type:Boolean,
    default:true
  }
}, {
  timestamps: true,
});
captainSchema.statics.isExist = async function (email) {
    const captain = await Captain.findOne({email:email})
    return captain? captain:false
}

const Captain = mongoose.model('Captain', captainSchema);    


module.exports = Captain;