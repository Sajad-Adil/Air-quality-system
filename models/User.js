const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true},

    password: { 
        type: String,
        require: true },
    email: { type: String,
        unique: true ,
        lowercase: true},

    name: { 
        type: String,
        require: true },
        

    location: String,

    refreshToken: String
    }
)

userSchema.index({name: 'text'});
module.exports = User = mongoose.model('user', userSchema)



