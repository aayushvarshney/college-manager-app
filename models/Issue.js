var mongoose = require('mongoose');

var issueSchema = new mongoose.Schema({
    name: String,
    description: String,
    resolved: Boolean,
    project: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },

        name: String
    },
    author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }, 
        username: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Issue", issueSchema);