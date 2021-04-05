const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema'),
BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
BloodBank = require('../../models/bloodBank/bloodBank/bloodBank');


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

//  @route /api/admin/bloodBankRequests/:req_id
// @desc DELETE accept blood bank request
// @access Private - admin access only
const acceptBloodBankRequest = async (req,res,next) =>{
    let request, bloodBank, profile;
    try {
        request = await BloodBankRequest.findById(req.params.req_id);
        const {bloodBankEmail, bloodBankName, bloodBankAddress, bloodBankPhone, bloodBankRegistrationNumber, location, bloodBankRegistrationDocument} = request;
        bloodBank = await BloodBank.findOne({email:bloodBankEmail});
        if (bloodBank) {
            return res.status(400).json({errors:[{msg : "Blood Bank with this email already exists!"}]});
        }
        bloodBank = await new BloodBank({
            email:bloodBankEmail
        });
        await bloodBank.save();
        profile = await BloodBankProfile.findOne({bloodBankEmail});
        if (profile) {
            return res.status(400).json({errors:[{msg : "Blood Bank with this profile already exists!"}]});
        }
        profile = await new BloodBankProfile({
            bloodBank:bloodBank.id,
            bloodBankName,
            bloodBankEmail,
            bloodBankAddress,
            bloodBankPhone,
            bloodBankRegistrationNumber,
            location,
            bloodBankRegistrationDocument
        });
     
        await profile.save();
        await request.delete();
        return res.status(200).json({msg:"Request accepted"});
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}


exports.getBloodBankRequest = getBloodBankRequest;
exports.acceptBloodBankRequest = acceptBloodBankRequest;