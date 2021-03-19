const BloodBank = require('../../models/bloodbank/bloodbankSchema'),
config=require('config'),
{validationResult}  = require('express-validator'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken');
const router = require('../../routes/bloodbank/bloodbank-routes');



    

//  @route /api/bloodbank/signup
// @desc  blodbsnk sign-up && put bloodbank info
// @access Public

const signUp = async (req,res,next) => {
    const {bname,btype,baddress,email,phone, password,bregnumber,bfile,baccredation} = req.body;
    let bloodbank;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        bloodbank= await BloodBank.findOne({email});
        if(bloodbank){
            return res.status(400).json({errors:[{msg : "Bloodbank with this email adress already exists"}]});
        }
        
        bloodbank=await BloodBank.findOne({bregnumber});
        if(bloodbank){
            return res.status(400).json({errors:[{msg:"Registration number already exists"}]})
        }
        
        bloodbank = new BloodBank({
            bname,
            btype,
            baddress,
            email,
            phone,
            password,
            bregnumber,
            bfile,
            baccredation,
        
        });
    
    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    bloodbank.password = await bcrypt.hash(password,salt);
    
    await bloodbank.save();

    // setting jwt
    const payload = {
        bloodbank : {
            id : bloodbank.id
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

    }catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
}


//@route /api/bloodbank/logIn
// @desc  bloodbank login
// @access Public

const logIn = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    let bloodbank
    try {
         bloodbank= await BloodBank.findOne({email});
        if(!bloodbank){
            return res.status(400).json({errors:[{msg : "invalid credentials"}]});
        }
        // check password
        const match =await bcrypt.compare(password,bloodbank.password);
        if(!match){
            return res.status(400).json({errors:[{msg : "invalid credentials"}]});
        }
        // setting jwt
        const payload = {
            bloodbank: {
                id : bloodbank
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


exports.signUp=signUp;
exports.logIn=logIn;