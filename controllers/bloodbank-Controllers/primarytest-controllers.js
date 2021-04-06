const { json } = require('body-parser'),
     primarytestSchema = require('../../models/user/primarytestSchema');
      Profile=require('../../models/user/profileSchema'),
      {validationResult}  = require('express-validator');


//  @route /api/user/primarytest/:user_id
// @desc post primarytest info
// @access Private

const primarytest = async (req,res,next) => {
    let {weight,pulse,hb,bp,tempreture} = req.body;


const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        let data = new primarytestSchema ({
            weight,
            pulse,
            hb,
            bp,
            tempreture
        });
        
         data.save();
       return  res.json(data);


    }
   catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}
exports.primarytest = primarytest;