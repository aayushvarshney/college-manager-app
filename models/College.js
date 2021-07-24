var mongoose = require('mongoose');

var CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("College", CollegeSchema);