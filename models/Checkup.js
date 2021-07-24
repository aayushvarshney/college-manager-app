var mongoose = require('mongoose');

var CheckupSchema = new mongoose.Schema({
    
    age: Number,
    symptoms:String,
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

module.exports = mongoose.model("Checkup", CheckupSchema);