var mongoose = require('mongoose');

var LeaveSchema = new mongoose.Schema({
    
    branch:String,
    address: String,
    days: Number,
    from: Date,
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

module.exports = mongoose.model("Leave", LeaveSchema);