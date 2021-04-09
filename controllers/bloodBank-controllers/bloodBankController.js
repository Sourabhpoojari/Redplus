const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema'),
bcrypt = require('bcryptjs'),
BloodBank = require('../../models/bloodBank/bloodBank/bloodBank'),
jwt = require('jsonwebtoken'),
config = require('config'),
{validationResult} = require('express-validator'),
BloodBankProfile = require('../../models/bloodBank/bloodBank/profile');


//  @route /api/bloodBank/signup
// @desc  post blood bank signup request
// @access Public
const signUpRequest = async (req,res,next) => {
    const {bloodBankName, bloodBankEmail, bloodBankAddress, bloodBankPhone, bloodBankRegistrationNumber, bloodBankLat, bloodBankLng, bloodBankRegistrationDocument} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let request;
    try {
        request = await BloodBankRequest.findOne({bloodBankEmail});
        if(request){
            return res.status(400).json({errors:[{msg : "Blood Bank already exists!"}]});
        }
        request = await new BloodBankRequest({
            bloodBankName, bloodBankEmail, bloodBankAddress, bloodBankPhone, bloodBankRegistrationNumber, bloodBankRegistrationDocument
        });
        if (bloodBankLng && bloodBankLat) {
            // request.location.coordinates.append(bloodBankLat,bloodBankLng);
            request.location.coordinates = [
                bloodBankLat,bloodBankLng
            ];
        }
        await request.save();
        return res.status(200).json(request);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

//@route /api/bloodbank/signup
// @desc put bloodbank signup for login details
// @access Public
const setPassword = async (req,res,next) =>{
    const {email,password} = req.body;
    let bloodBank;
    try {
        bloodBank = await BloodBank.findOne({email});
        if (!bloodBank) {
            return res.status(400).json({errors:[{msg : "You need to register before login!"}]});
        }
        const salt = await bcrypt.genSalt(10);
        bloodBank.password = await bcrypt.hash(password,salt);
        await bloodBank.save();
         // setting jwt
         const payload = {
             bloodBank : {
                 id : bloodBank.id
             }
         };
         jwt.sign(
             payload,
             config.get('jwtSecret'),
             {expiresIn : 3600},
             (err,token)=>{
                 if(err) throw err;
                  return res.status(200).json({token});
             }
         );

    } catch (err) {
    console.log(err);
       return res.status(500).send('Server error');
    }
}

//@route /api/bloodbank/logIn
// @desc post bloodbank login
// @access Public
const logIn = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    let bloodBank;
    try {
        bloodBank= await BloodBank.findOne({email});
        if( !bloodBank || !bloodBank.password || !bloodBank.isBloodBank ){
            return res.status(400).json({errors:[{msg : "You need to register before login!"}]});
        }
        // check password
        const match =await bcrypt.compare(password,bloodBank.password);
        if(!match){
            return res.status(400).json({errors:[{msg : "invalid credentials"}]});
        }
        // setting jwt
        const payload = {
            bloodBank: {
                id : bloodBank.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn : 3600},
            (err,token)=>{
                if(err) throw err;
                 res.status(200).json({token});
            }
        );
    } catch (err) {
        console.log(err);
       return res.status(500).send('Server error');
    }
};

//@route /api/bloodbank/profile
// @desc get bloodBank profile
// @access Private bloodBank access only
const getProfile = async (req,res,next)=>{
    try {
        const profile = await BloodBankProfile.findOne({bloodBank : req.bloodBank.id});
        if (!profile) {
           return res.status(400).json({msg:"Profile not found!"});
        }
        else{
        
        res.json(profile);}
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg:"Profile not found!"});
        }
        res.status(500).send("Server error");
    }
};

exports.signUpRequest = signUpRequest;
exports.setPassword = setPassword;
exports.logIn = logIn;
exports.getProfile = getProfile;
