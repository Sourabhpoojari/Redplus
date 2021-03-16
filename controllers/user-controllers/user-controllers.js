const User = require('../../models/user/userSchema'),
config = require('config'),
accountSid = config.get('TWILIO_ACCOUNT_SID1'),
authToken = config.get('TWILIO_AUTH_TOKEN'),
sid = config.get('TWILIO_SID'),
{validationResult}  = require('express-validator'),
 client = require('twilio')(accountSid, authToken),
 bcrypt = require('bcryptjs'),
 jwt = require('jsonwebtoken');


//  @route /api/phone
// @desc post user phone number && send OTP
// @access Public
const getPhone = async (req,res,next) => {
    const {phone} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    user= await User.findOne({phone});
        if(user){
            return res.status(400).json({errors:[{msg : "User with this phone number already exists"}]});
        }
    try {
    //   const service = await  client.verify.services.create({friendlyName: 'Red Plus'});
    // console.log(service);
                    client.verify.services(sid)
                    .verifications
                    .create({to: phone, channel: 'sms'})
                    .then(verification => {
                        // console.log(verification);

                    return res.status(200).send(verification.sid);
                    })
                    .catch(err => console.error(err));
                   
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Phone number error!");
    }
}
//  @route /api/phone/verify
// @desc post user phone number && verify OTP
// @access Public
const verifyOtp = async (req,res,next) => {
    const {phone, code} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let user;
    try {
    //     const service = await  client.verify.services.create({friendlyName: 'Red Plus'});
    // console.log(service);
        user= await User.findOne({phone});
        if(user){
            return res.status(400).json({errors:[{msg : "User with this phone number already exists"}]});
        }
        
        client.verify.services(sid)
      .verificationChecks
      .create({to: phone, code: code})
      .then(verification_check => {
          console.log(verification_check);
          if (verification_check.status == 'approved') {
              user =  new User({phone});
              user.isVerified = true;
               user.save();
          }
          return res.status(200).send(verification_check.status);
    })
    .catch(err => {console.error(err);
        return res.status(408).send("Incorrect OTP");
    });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
}

//  @route /api/user/signup
// @desc  User sign-up && put user info
// @access Public
const signUp = async (req,res,next) => {
    const {name,phone, password } = req.body;
    let user;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        user = await User.findOne({phone});
        if(!user){
            return res.status(400).json({errors:[{msg : "Please verify your phone number before signup"}]});
        }
        if (user.name != null) {
            return res.status(400).json({errors:[{msg : "User already"}]});
        }
        user.name = name;
        // bcrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        // setting jwt
        const payload = {
            user : {
                id : user.id
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
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
}

//  @route /api/user/logIn
// @desc  User login
// @access Public
const logIn = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {phone,password} = req.body;
    let user
    try {
         user= await User.findOne({phone});
        if(!user){
            return res.status(400).json({errors:[{msg : "invalid credentials"}]});
        }
        // check password
        const match =await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({errors:[{msg : "invalid credentials"}]});
        }
        // setting jwt
        const payload = {
            user : {
                id : user.id
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
}


exports.getPhone = getPhone;
exports.verifyOtp = verifyOtp;
exports.signUp = signUp;
exports.logIn = logIn;