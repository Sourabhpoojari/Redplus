const jwt = require('jsonwebtoken'),
    config = require('config'),
    BloodBank = require('../models/bloodBank/bloodBank/bloodBank');

module.exports =async (req,res,next)=>{
    const token = req.header('x-auth-token');
    // if no token
    if(!token){
        return res.status(401).json({msg:'No token found, authorization denied'});
    }
    // verify token 
    let bloodBank;
    try {
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        bloodBank = await BloodBank.findById(decoded.bloodBank.id);
        if (!bloodBank.isBloodBank) {
            return res.status(401).json({msg:'Authorization denied'});
        }
        req.bloodBank = decoded.bloodBank;
        next();
    } catch (err) {
        res.status(401).json({msg:'Token is not valid'});
    }
};