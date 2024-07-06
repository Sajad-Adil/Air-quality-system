const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'emial and password are required.' });

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.sendStatus(401).json({'message': 'error, user is unauthorized' }); //Unauthorized 
    
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "phoneNumber": foundUser.phoneNumber,
                    "userId": foundUser._id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            
            { expiresIn: '1d' }
        );

        const result = await foundUser.save();
        console.log(result);
        res.json({  accessToken });

    } else {
        res.sendStatus(401);
    }};
module.exports = { handleLogin };
