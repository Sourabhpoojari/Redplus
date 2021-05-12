const hospitalRequest = require('../../models/admin/requests/hospitalRequestSchema'),
bcrypt = require('bcryptjs'),
Hospital = require('../../models/hospital/hospital/hospital'),
jwt = require('jsonwebtoken'),
config = require('config'),
{validationResult} = require('express-validator'),
HospitalProfile = require('../../models/hospital/hospital/profile');


//  @route /api/hospital/signup request
// @desc  post hospital signup request
// @access Public
    const signUpRequest = async (req,res,next) => {
    const {hospitalName, hospitalEmail, hospitalAddress, hospitalPhone, hospitalRegistrationNumber, hospitalLat, hospitalLng, hospitalRegistrationDocument} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let request;
    try {
            request = await hospitalRequest.findOne({hospitalEmail});
            if(request){
                return res.status(400).json({errors:[{msg : "Hospital already exists!"}]});
            }
            request = await new hospitalRequest({
                hospitalName, hospitalEmail, hospitalAddress, hospitalPhone, hospitalRegistrationNumber, hospitalRegistrationDocument
            });
            if (hospitalLng && hospitalLat) {
                // request.location.coordinates.append(hospitalLat,hospitalLng);
                request.location.coordinates = [
                    hospitalLat,hospitalLng
                ];
            }
            await request.save();
            return res.status(200).json(request);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
    }


    //@route /api/hospital/signup
// @desc put hospital signup for login details
// @access Public
const setPassword = async (req,res,next) =>{
    const {email,password} = req.body;
    let hospital;
    try {
        hospital = await Hospital.findOne({email});
        if (!hospital) {
            return res.status(400).json({errors:[{msg : "You need to register before login!"}]});
        }
        const salt = await bcrypt.genSalt(10);
        hospital.password = await bcrypt.hash(password,salt);
        await hospital.save();
         // setting jwt
         const payload = {
             hospital : {
                 id : hospital.id
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
    
//@route /api/hospital/logIn
// @desc put hospital  login 
// @access Public

const logIn = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    let hospital;
    try {
        hospital= await Hospital.findOne({email});
        if(!hospital){
            return res.status(400).json({errors:[{msg : "You need to register before login!"}]});
        }
        // check password
        const match =await bcrypt.compare(password,hospital.password);
        if(!match){
            return res.status(400).json({errors:[{msg : "invalid credentials"}]});
        }
        // setting jwt
        const payload = {
            hospital: {
                id : hospital.id
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



//@route /api/hospital/profile
// @desc get hospital profile
// @access Private hospital access only
const getProfile = async (req,res,next)=>{
    try {
        const profile = await HospitalProfile.findOne({hospital : req.hospital.id});
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
exports.logIn=logIn;
exports.getProfile=getProfile;