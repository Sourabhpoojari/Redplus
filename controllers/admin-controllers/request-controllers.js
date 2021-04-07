const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema'),
BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
BloodBank = require('../../models/bloodBank/bloodBank/bloodBank'),
config = require('config'),
sgMail = require('@sendgrid/mail'),
SENDGRID_API_KEY = config.get('SENDGRID_API_KEY');
sgMail.setApiKey(SENDGRID_API_KEY);


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
// @desc POST accept blood bank request
// @access Private - admin access only
const acceptBloodBankRequest = async (req,res,next) =>{
    let request, bloodBank, profile;
    try {
        request = await BloodBankRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        const {bloodBankEmail, bloodBankName, bloodBankAddress, bloodBankPhone, bloodBankRegistrationNumber, location, bloodBankRegistrationDocument} = request;
        bloodBank = await BloodBank.findOne({email:bloodBankEmail});
        if (bloodBank) {
            return res.status(400).json({errors:[{msg : "Blood Bank with this email already exists!"}]});
        }
        bloodBank = await new BloodBank({
            email:bloodBankEmail
        });
        
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
        const msg = {
            to: bloodBankEmail, // Change to your recipient
            from: 'redplus112@gmail.com', // Change to your verified sender
            subject: 'Request accepted',
            text: 'Your registraion to Redplus is accepted. Kindly use below link to set-up your password and login to your account using emailID '+bloodBankEmail
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          }
         sgMail.send(msg).then(async () => {
            bloodBank.isBloodBank = true;
            await bloodBank.save();
            await profile.save();
            await request.delete();
            return res.status(200).json({msg:"Request accepted"});
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).send('Send grid error!');
          })
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

//  @route /api/admin/bloodBankRequests/:req_id
// @desc DELETE reject blood bank request
// @access Private - admin access only
const rejectBloodBankRequest = async (req,res,next) =>{
    let request;
    try {
        request = await BloodBankRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        const msg = {
            to: request.bloodBankEmail, // Change to your recipient
            from: 'redplus112@gmail.com', // Change to your verified sender
            subject: 'Request Rejected',
            text: 'Your registraion to Redplus is rejected.'
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          }
        const status = await sgMail.send(msg);
        if (status) {
            await request.delete();
        return res.status(200).json({msg:"Request rejected!"})
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.getBloodBankRequest = getBloodBankRequest;
exports.acceptBloodBankRequest = acceptBloodBankRequest;
exports.rejectBloodBankRequest = rejectBloodBankRequest;