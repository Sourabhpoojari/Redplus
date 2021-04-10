const primarytestSchema = require('../../models/user/primarytestSchema');
      Profile=require('../../models/user/profileSchema'),
      Donation = require('../../models/user/donationSchema'),
      {validationResult}  = require('express-validator');


//  @route /api/user/primarytest/:user_id
// @desc post primarytest info
// @access Private

const primarytest = async (req,res,next) => {
    let {weight,pulse,hb,bp,temp} = req.body;
    let donation;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    } 

    const {gender} = await Profile.findOne({user:req.params.user_id}).select('gender');
    if (!gender) {
        return res.status(422).send('Donor not found!');
    }

    if(gender == "male")
        if(weight < 50)
            return res.status(422).send('Weight must be greater than 50'); 
        if(hb < 13  || hb > 20)
            return res.status(422).send('hb must be in the range 13-20'); 

    if(gender == "female")
        if(weight < 45)
            return res.status(422).send('Weight must be greater than 45'); 
        if(hb < 12.5  || hb > 20)
            return res.status(422).send('hb must be in the range 12.5-20'); 
    
    if(pulse < 60  || pulse >100)
        return res.status(422).send('Pulse must be in the range 60-100'); 
    
    if(bp < 100  || bp > 180)
        return res.status(422).send('bp must be in the range 100-180'); 
    
    if(temp > 99.5)
        return res.status(422).send('tempreture must be less than 99.5'); 
    try{
        let data ={
            user:req.params.user_id,
            bloodbank:req.bloodBank.id,
            weight,
            pulse,
            hb,
            bp,
            temp
        }
        primary = new primarytestSchema(data);
         await primary.save();
        donation = new Donation({
            bloodBank:req.bloodBank.id,
            user:req.params.user_id
        });
       return  res.status(200).json({msg:'You can donate blood'});


    }
   catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}
exports.primarytest = primarytest;