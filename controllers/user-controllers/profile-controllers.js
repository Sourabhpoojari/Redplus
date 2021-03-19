const Profile = require('../../models/user/profileSchema'),
    config = require('config'),
    cloudinary = require('cloudinary'),
    validator = require('aadhaar-validator'),
    {validationResult} = require('express-validator'),
    CLOUDINARY_API_KEY = config.get('CLOUDINARY_API_KEY'),
    CLOUDINARY_SECRET = config.get('CLOUDINARY_SECRET');
    User = require('../../models/user/userSchema');

// set-up cloudinary
cloudinary.config({
    cloud_name: 'redplus', 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_SECRET
});

  
//  @route /api/user/getprofile
// @desc post user getprofile
// @access Private

const getProfile = async (req,res,next)=>{
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user',['phone']);
        if (!profile) {
           return res.status(400).json({msg:"Profile not found!"});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg:"Profile not found!"});
        }
        res.status(500).send("Server error");
    }
};


//  @route /api/user/profile
// @desc post user profile
// @access Private
const createProfile = async (req,res,next)  => {
    // console.log(req.body);
    const {  name, fatherName, email, address, gender, dateOfBirth, aadhaar, bloodGroup } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    if (!validator.isValidNumber(aadhaar) ) {
        return res.status(400).send("Invalid aadhar number");
    }
    let profile;
    try {

        const profileFields = {
            user:req.user.id,
            name,
            fatherName,
            email,
            address,
            gender,
            dateOfBirth,
            aadhaar,
            bloodGroup
        };
        if (req.file) {
           const result = await cloudinary.uploader.upload(req.file.path);
           profileFields.profileImage = result.secure_url;
        }
        
        profile = await Profile.findOne({user:req.user.id});
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user : req.user.id },
                { $set: profileFields},
                { new : true}
               );
           return res.json(profile);
        }
        profile = new Profile(profileFields);
         await profile.save();
         return res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

exports.getProfile = getProfile;
exports.createProfile = createProfile;