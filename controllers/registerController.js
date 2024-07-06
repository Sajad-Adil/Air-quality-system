const bcrypt = require('bcrypt');
const User = require('../models/User'); 

const handleNewUser = async (req, res) => {
    const { email, password, name, location } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict

    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            "email": email,
            "password": hashedPassword,
            "name": name,
            "location": location
        });

        console.log(result);
        res.status(201).json({ 'success': `New user created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };
