const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema'),
BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
BloodBank = require('../../models/bloodBank/bloodBank/bloodBank'),
HospitalRequest = require('../../models/admin/requests/hospitalRequestSchema'),
Hospitalprofile = require('../../models/hospital//hospital/profile'),
Hospital = require('../../models/hospital/hospital/hospital'),
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
        const status = await sgMail.send(msg);
        if (status) {
            bloodBank.isBloodBank = true;
            await bloodBank.save();
            await profile.save();
        await request.delete();
        return res.status(200).json({msg:"Request accepted"});
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}


//  @route /api/admin/hospitalRequests
// @desc  get hospital requests
// @access Private - admin access only
const getHospitalRequest = async (req,res,next) => {
    let requests;
    try {
        requests = await HospitalRequest.find();
        if (!requests) {
            return res.status(404).send("No request found!");
        }
        return res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}




//  @route /api/admin/hospitalRequests/:req_id
// @desc POST accept hospital request
// @access Private - admin access only
const acceptHospitalRequest = async (req,res,next) =>{
    let request, hospital, profile;
    try {
        request = await HospitalRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        const {hospitalEmail, hospitalName, hospitalAddress, hospitalPhone, hospitalRegistrationNumber, location, hospitalRegistrationDocument} = request;
        hospital = await Hospital.findOne({email:hospitalEmail});
        if (hospital) {
            return res.status(400).json({errors:[{msg : "Hospital with this email already exists!"}]});
        }
        hospital = await new Hospital({
            email:hospitalEmail
        });
        
        profile = await Hospitalprofile.findOne({hospitalEmail});
        if (profile) {
            return res.status(400).json({errors:[{msg : "Hospital with this profile already exists!"}]});
        }
        profile = await new Hospitalprofile({
            hospital:hospital.id,
            hospitalName,
            hospitalEmail,
            hospitalAddress,
            hospitalPhone,
            hospitalRegistrationNumber,
            location,
            hospitalRegistrationDocument
        });
        const msg = {
            to: hospitalEmail, // Change to your recipient
            from: 'redplus112@gmail.com', // Change to your verified sender
            subject: 'Request accepted',
            text: 'Your registraion to Redplus is accepted. Kindly use below link to set-up your password and login to your account using emailID '+hospitalEmail
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          }
        const status = await sgMail.send(msg);
        if (status) {
            hospital.isHospital = true;
            await hospital.save();
            await profile.save();
        await request.delete();
        return res.status(200).json({msg:"Request accepted"});
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.getBloodBankRequest = getBloodBankRequest;
exports.acceptBloodBankRequest = acceptBloodBankRequest;
exports.getHospitalRequest = getHospitalRequest;
exports.acceptHospitalRequest = acceptHospitalRequest;