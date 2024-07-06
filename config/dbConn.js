const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Sajadzn5:1984machine1984@cluster1.c4zgkbp.mongodb.net/AirQ", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}
module.exports = connectDB;
