var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    issue: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue"
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

module.exports = mongoose.model("Comment", commentSchema);