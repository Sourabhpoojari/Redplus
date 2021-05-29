const BloodCamps = require('../../models/camp/organizeCampSchema');

//  @route /api/user/:id
// @desc  get blood Bank profile info
// @access Private - authorized user access only
const getCampById = async (req,res,next) =>{

    try {
        const camp = await BloodCamps.findById(req.params.id);
        if (!camp) {
            return res.status(400).json({errors:[{msg : "No Camps found!"}]});
        }
        return res.status(200).json(camp);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.getCampById=getCampById;