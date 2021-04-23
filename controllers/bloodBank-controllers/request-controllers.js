const DonorRequest = require('../../models/bloodBank/request/userRequestSchema');



//  @route /api/bloodBank/requests/donorRequests
// @desc get Donor requests
// @access Private - blood bank access only
const getDonorRequests = async (req,res,next) =>{
    let request;
    try {
        request = await DonorRequest.find().populate('User',['name','phone','profileImage']);
        if (!request) {
            return res.status(404).json({errors:[{msg : "No requests found!"}]});
        }
        return res.status(200).json({request});
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
}


//  @route /api/bloodbank/:id
// @desc  get user info
// @access Private - bloodbank access only
const getDonorById = async (req,res,next) =>{
    let donor;
    try {
        donor = await DonorRequest.findById(req.params.id);
        if (!donor) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        return res.status(200).json(donor);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}



exports.getDonorRequests = getDonorRequests;
exports.getDonorById = getDonorById;