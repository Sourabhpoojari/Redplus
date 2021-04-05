const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema');


//  @route /api/admin/bloodBankRequests
// @desc  get blood Bank requests
// @access Private - admin access only
const getBloodBankRequest = async (req,res,next) => {
    let requests;
    try {
        requests = await BloodBankRequest.find();
        if (!requests) {
            return res.status(404).send("No request found!");
        }
        return res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.getBloodBankRequest = getBloodBankRequest;