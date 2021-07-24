var mongoose = require('mongoose');

var HostelSchema = new mongoose.Schema({
    name:String,
    status:{
        type: String,
        default: 'no'
    },
    college: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College"
        },

        name: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Hostel", HostelSchema);