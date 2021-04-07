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




exports.getDonorRequests = getDonorRequests;