const Profile = require('../../models/user/profileSchema');


//  @route /api/user/profile
// @desc post user profile
// @access Private
const createProfile = async (req,res,next)  => {
    const { profileImage, name, fatherName, email, address, gender, dateOfBirth, aadhaar, bloodGroup } = req.body;
    let profile;
    try {
        profile = await Profile.findOne({user:req.user.id});
        if (profile) {
            
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}