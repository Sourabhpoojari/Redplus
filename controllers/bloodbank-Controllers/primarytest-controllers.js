const PTest= require('../../models/user/primarytestSchema'),
      user=require('../../models/user/profileSchema'),
      {validationResult}  = require('express-validator');


//  @route /api/user/primarytest/:user_id
// @desc post primarytest info
// @access Private

const primarytest = async (req,res,next) => {
    let {weight,pulse,hb,bp,tempreture} = req.body;
}

const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{

    }
    catch{
        
    }