const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:  String
    },
    phone: {
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    profileImage:{
        type:String,
        default : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('User',userSchema);