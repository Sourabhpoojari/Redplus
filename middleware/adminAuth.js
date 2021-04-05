const jwt = require('jsonwebtoken'),
    config = require('config'),
    Admin = require('../models/admin/adminSchema');

module.exports =async (req,res,next)=>{
    const token = req.header('x-auth-token');
    // if no token
    if(!token){
        return res.status(401).json({msg:'No token found, authorization denied'});
    }
    // verify token 
    let admin;
    try {
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        admin = await Admin.findById(decoded.admin.id);
        if (!admin.isAdmin) {
            return res.status(401).json({msg:'Authorization denied'});
        }
        req.admin = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg:'Token is not valid'});
    }
};