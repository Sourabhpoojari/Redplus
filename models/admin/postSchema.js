const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    UploadedOn: {
		type: String,
	},
    
});

module.exports=mongoose.model('DashBoardPost',postSchema);