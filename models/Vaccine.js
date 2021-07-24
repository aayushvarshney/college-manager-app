var mongoose = require('mongoose');

var VaccineSchema = new mongoose.Schema({
    
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

module.exports = mongoose.model("Vaccine", VaccineSchema);