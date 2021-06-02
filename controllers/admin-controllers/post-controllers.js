const { localeData } = require('moment');
const moment = require('moment'),
{validationResult}  = require('express-validator'),
 Poster = require('../../models/admin/postSchema');



 //  @route /api/admin/post/uploadposter
// @desc  upload post
// @access Private to Admin

const uploadPoster = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let {description,poster} = req.body;
    try {
        let uploadposter = await Poster.find();
        if(!uploadposter){
            return res.status(400).json({msg : "No poster found"});
        }

        uploadposter = await new Poster({
            description,
			poster,
            UploadedOn: moment().format('DD-MM-YYYY')
		});

        await uploadposter.save();
        return res.status(200).json(uploadposter);
       
    } catch (err) {
        console.log(err);
       return res.status(500).send('Server error');
    }
}


//  @route /api/admin/post/deleteposter
// @desc  delete post
// @access Private to Admin
const deletePoster = async(req,res,next)=>{
    
  
    try {
        const poster = await Poster.findOneAndDelete(req.params.post_id);
        if(!poster){
            return res.status(400).json({msg : "No poster found"});
        }

        await poster.delete();
        return res.status(200).json({ msg: 'Poster Deleted' });
       
    } catch (err) {
        console.log(err);
       return res.status(500).send('Server error');
    }
}

//  @route /api/admin/post/getposter
// @desc  delete post
// @access Private to Admin
const getPoster = async(req,res,next)=>{
    
    try {
        const poster = await Poster.find().sort('-UploadedOn');
        if(poster.length == 0){
            return res.status(400).json({msg : "No poster found"});
        }

        return res.status(200).json(poster);
       
    } catch (err) {
        console.log(err);
       return res.status(500).send('Server error');
    }
}


//  @route /api/admin/post/getposter
// @desc  delete post
// @access Private to Admin
const getPosterById = async(req,res,next)=>{
    
    try {
        const poster = await Poster.findById(req.params.id);
        if(!poster){
            return res.status(400).json({msg : "No poster found"});
        }

        return res.status(200).json(poster);
       
    } catch (err) {
        console.log(err);
       return res.status(500).send('Server error');
    }
}


exports.uploadPoster = uploadPoster;
exports.deletePoster=deletePoster;
exports.getPoster=getPoster;
exports.getPosterById=getPosterById;