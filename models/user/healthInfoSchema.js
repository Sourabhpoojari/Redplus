const mongoose = require('mongoose');

const healthInfoSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    previousDonation:{
        isDonated: {
            type:Boolean,
            default:false
            // required:true
        },
        date : {
            type:Date
        }
    },
    lastMeal:{
        type:Date
        // required:true
    },
    history :[
        {
            type:String
        }
    ],
    disease : [
        {
            type:String
        }
    ],
    consumptions :[
        {
            type:String
        }
    ],
    result:{
        type:Boolean,
        default:true
    },
    pregnant : {
        isPregnant:{
            type:Boolean,
            default:false
        },
        abortion :{
            type:Boolean,
            default:false
        },
        child:{
            type:Boolean,
            default:false
        },
        periods:{
            type:Boolean,
            default:false
        }
    },
    createdOn : {
        type:Date,
        default:Date.now()
    }
       

});

module.exports = mongoose.model('HealthInfo',healthInfoSchema);