const mongoose = require('mongoose');

const userRequestSchema = mongoose.Schema({
    donor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    requestedAt :{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('DonorRequest',userRequestSchema);
