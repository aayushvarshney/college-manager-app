var mongoose = require('mongoose');

var ArrivalSchema = new mongoose.Schema({
    
    branch:String,
    address: String,
    between: Date,
    to: Date,
    hostel: String,
    mobileno:Number,
    covid: String,
    status: {
        type: String,
        default: 'pending'
    },
    user: {

        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        name: String
    },
    college: {

        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College"
        },

        name: String
    }
})

module.exports = mongoose.model("Arrival", ArrivalSchema);