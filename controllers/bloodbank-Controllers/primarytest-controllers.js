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
        
        const profile =  Profile.findOne({user : req.params.user_id}).select('user');
        if (!profile) {
           return res.status(400).json({msg:"Profile not found!"});
        }
        const primary =  primarytestSchema.findOne({user : req.params.user_id}).select('user');

        let data = new primarytestSchema ({
            weight,
            pulse,
            hb,
            bp,
            tempreture
        });
        if(profile == primary){
         data.save();
        }


       return  res.json(data);


    }
   catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}
exports.primarytest = primarytest;