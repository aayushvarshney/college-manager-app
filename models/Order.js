var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    
    hostel:String,
    mobileno:Number,
    from: String,
    item: String,
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

module.exports = mongoose.model("Order", OrderSchema);