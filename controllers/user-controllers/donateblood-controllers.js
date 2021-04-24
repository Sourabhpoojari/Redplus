
const BloodBank = require('../../models/bloodbank/bloodBank/profile'),
    Camp = require('../../models/camp/organizeCampSchema'),
    {validationResult}  = require('express-validator');

//  @route /api/user/donateblood
// @desc get bloodBank list based on currrent location
// @access Private
const bloodbankinfo = async (req,res,next) => {
    let {lat,lang} = req.body;

     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
     } 
    // try{
    //     const bloodbank = await BloodBank.find({
    //         location:{
    //             $near:{
    //                 $geometry:{
    //                     type:"Point",
    //                     coordinates:[lat,lang]
    //                 },
    //                //distanceField: "distcalculated",
    //                 $maxDistance: 50000
    //                 //spherical: true
    //             }
    //         }
    //     });
    //     //console.log(bloodbank);
    //     return res.status(201).json(bloodbank);  
    // }
     try{
         BloodBank.aggregate([
            {
              $geoNear: {
                 near: { 
                   type: "Point",
                   coordinates: [ lat , lang]
                 },
                 distanceField: "distance",
                 maxDistance:50000,
                 spherical: true
              }
            }
           ],(err,data)=>{
            if(err) {
              next(err);
              return;
            }
           data.forEach(item => {
               item.distance = parseFloat(item.distance/1000).toFixed(2);
           });
            res.send(data);
          })
     }
    catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    }




exports.bloodbankinfo= bloodbankinfo;
