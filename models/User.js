var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    name:String,
    username: String,
    password: String,
    role: String,
    vaccine:{
        type:String,
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

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);