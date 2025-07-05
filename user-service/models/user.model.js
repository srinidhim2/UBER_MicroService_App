const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});
userSchema.statics.isExist = async function (email) {
    const user = await User.findOne({email:email})
    return user? user:false
}

const User = mongoose.model('User', userSchema);    


module.exports = User;