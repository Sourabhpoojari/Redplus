const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema'),
campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema'),
BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
BloodBank = require('../../models/bloodBank/bloodBank/bloodBank'),
HospitalRequest = require('../../models/admin/requests/hospitalRequestSchema'),
Hospitalprofile = require('../../models/hospital//hospital/profile'),
Hospital = require('../../models/hospital/hospital/hospital'),
config = require('config'),
sgMail = require('@sendgrid/mail'),
SENDGRID_API_KEY = config.get('SENDGRID_API_KEY');

sgMail.setApiKey(SENDGRID_API_KEY),
accountSid = config.get('TWILIO_ACCOUNT_SID1'),
authToken = config.get('TWILIO_AUTH_TOKEN'),
client = require('twilio')(accountSid, authToken),
sid = config.get('TWILIO_SID');



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


//  @route /api/admin/bloodBank/:id
// @desc  get blood Bank info
// @access Private - admin access only
const getBloodBankById = async (req,res,next) =>{
    let bloodBank;
    try {
        bloodBank = await BloodBankRequest.findById(req.params.id);
        if (!bloodBank) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        return res.status(200).json(bloodBank);
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
            return res.status(302).json({errors:[{msg : "Blood Bank with this email already exists!"}]});
        }
        bloodBank = await new BloodBank({
            email:bloodBankEmail
        });
        
        profile = await BloodBankProfile.findOne({bloodBankEmail});
        if (profile) {
            return res.status(302).json({errors:[{msg : "Blood Bank with this profile already exists!"}]});
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


//  @route /api/admin/hospitalRequests/:id
// @desc  get hospital request info by id
// @access Private - admin access only
const getHospitalById = async (req,res,next) =>{
    let hospital;
    try {
        hospital = await HospitalRequest.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({errors:[{msg : "Request not found!"}]});
        }
        return res.status(200).json(hospital);
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
            await hospital.save();-
            await profile.save();
        await request.delete();
        return res.status(200).json({msg:"Request accepted"});
        }    
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}


//  @route /api/admin/hospitalRequests/:req_id
// @desc DELETE reject hospital request
// @access Private - admin access only
const rejecthospitalRequest = async (req,res,next) =>{
    let request;
    try {
        request = await HospitalRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        const msg = {
            to: request.hospitalEmail, // Change to your recipient
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


//  @route /api/admin/capsheduleBankRequests
// @desc  get campshedule requests
// @access Private - admin access only
const getCampSheduleRequest = async (req,res,next) => {
    let requests;
    try {
        requests = await campSheduleRequest.find();
        if (!requests) {
            return res.status(404).send("No request found!");
        }
        return res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

//  @route /api/admin/campshedule/:id
// @desc  get campshedule info
// @access Private - admin access only
const getCampSheduleId = async (req,res,next) =>{
    let camp;
    try {
        camp = await campSheduleRequest.findById(req.params.id);
        if (!camp) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        return res.status(200).json(camp);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}


//  @route /api/admin/campsheduleRequests/:req_id
// @desc POST accept camp shedule request
// @access Private - admin access only
const acceptCampSheduleRequest = async (req,res,next) =>{
    let request,camp,organize;
    try {
        request = await campSheduleRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        const {campAddress,campName,campSchedule,capacity,community,organizerContactNumber,organizerName,referenceId,sponserOrganization, location} = request;
        
        
        camp = await OrganizeCamp.findOne({organizerContactNumber});
        if (camp) {
            return res.status(302).json({errors:[{msg : " already camp exists!"}]});
        }
        organize = await new OrganizeCamp({
            campAddress,
            campName,
            campSchedule,
            capacity,
            community,
            organizerContactNumber,
            organizerName,
            referenceId,
            sponserOrganization,
            location
        });
        
          
client.messages
  .create({
     body: 'Your Camp shedule is Accepted..',
     from: '+15017122661',
     to: organizerContactNumber
   })
  .then(async () => {
    
    await organize.save();
    await request.delete();
    return res.status(200).json({msg:"Request accepted"});
  })
          .catch((err) => {
            console.error(err);
            return res.status(500).send('msg not sent!');
          })
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

//  @route /api/admin/campsheduleRequests/:req_id
// @desc DELETE reject camp shedule request
// @access Private - admin access only
const rejectcampsheduleRequest = async (req,res,next) =>{
    let request;
    try {
        request = await campSheduleRequest.findById(req.params.req_id);
        if (!request) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        
        client.messages
    .create({
    body: 'Your Camp shedule is Accepted..',
    from: '+15017122661',
    to: request.organizerContactNumber
        })
        
        await request.delete();
        return res.status(200).json({msg:"Request rejected!"})
        
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}


exports.getBloodBankRequest = getBloodBankRequest;
exports.acceptBloodBankRequest = acceptBloodBankRequest;
exports.getHospitalRequest = getHospitalRequest;
exports.acceptHospitalRequest = acceptHospitalRequest;
exports.rejectBloodBankRequest = rejectBloodBankRequest;
exports.rejecthospitalRequest = rejecthospitalRequest;
exports.getBloodBankById = getBloodBankById;
exports.getHospitalById = getHospitalById;
exports.getCampSheduleRequest=getCampSheduleRequest;
exports.getCampSheduleId=getCampSheduleId;
exports.acceptCampSheduleRequest=acceptCampSheduleRequest;
exports.rejectcampsheduleRequest=rejectcampsheduleRequest;