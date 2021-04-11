const jwt = require('jsonwebtoken'),
config = require('config'),
Hospital = require('../models/hospital/hospital/hospital');

module.exports = async (req,res,next) =>{
    const token = req.header('x-auth-token');
    
    //if no token 
    if(!token){
       return  res.status(401).json({msg:'no token found , permision deneid '});
    }
    //varify
    let hospital;
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        hospital = await Hospital.findById(decoded.hospital.id);
        
    if(!hospital.isHospital){
            return  res.status(401).json({msg:'not Authorised'});
        }
        req.hospital = decoded.hospital;
        next();
    }
    catch(err){
        return  res.status(401).json({msg:'token not valid'});
    }
}