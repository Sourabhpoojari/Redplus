const DonorRequest = require('../../models/bloodBank/request/userRequestSchema'),
Profile = require('../../models/user/profileSchema');


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


//  @route /api/user/:id
// @desc  get user info
// @access bloodbank
const getDonorById = async (req,res,next) =>{
    let donor;
    try {
        donor = await Profile.findById(req.params.id);
        if (!donor) {
            return res.status(400).json({errors:[{msg : "Profile not found!"}]});
        }
        return res.status(200).json(donor);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

//  @route /api/bloodbank/request/acceptdonationrequest/:req_id
// @desc POST accept donation shedule request
// @access Private - bloodbank access only
const acceptdonationRequest = async (req,res,next) =>{
    let request;
    try {
        request = await DonorRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        
    await request.delete();
    return res.status(200).json({msg:"Request accepted"});
  
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

//  @route /api/admin/campsheduleRequests/:req_id
// @desc DELETE reject camp shedule request
// @access Private - admin access only
const rejectDonorRequest = async (req,res,next) =>{
    let request;
    try {
        request = await DonorRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Profile not found!"}]});
        }
        await request.delete();
        return res.status(200).json({msg:"Request rejected!"})
        
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.getDonorRequests = getDonorRequests;
exports.getDonorById = getDonorById;