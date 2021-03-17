const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profileImage : {
        type:String,
        default:"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"
    },
    name :{
        type:String,
        required:true
    },
    fatherName:{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    address : {
        type:String,
        required:true
    },
    gender : {
        type:String,
        required:true
    },
    dateOfBirth : {
        type:Date,
        required:true
    },
    aadhaar :{
        type:Number,
        required:true
    },
    bloodGroup : {
        type:String,
        required:true
    },
    createdOn :{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('Profile',profileSchema);