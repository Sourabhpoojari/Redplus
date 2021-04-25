
const BloodBank = require('../../models/bloodbank/bloodBank/profile'),
    Camp = require('../../models/camp/organizeCampSchema'),
    {validationResult}  = require('express-validator');

//  @route /api/user/donateblood
// @desc get bloodBank list based on currrent location
// @access Private
const donateBloodInfo = async (req,res,next) => {
    const {lat,lang} = req.body;

     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
     } 

     try{
          let bloodBank = await  BloodBank.aggregate([
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
           ]);
          bloodBank.forEach(item => {
                 item.distance = parseFloat(item.distance/1000).toFixed(2);
             });
          let camps = await Camp.aggregate([
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
          ]);
         
          camps.forEach(item => {
            item.distance = parseFloat(item.distance/1000).toFixed(2);
        });

        return res.status(200).json({bloodBanks:bloodBank, camps:camps});
     }
    catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    }




exports.donateBloodInfo= donateBloodInfo;
