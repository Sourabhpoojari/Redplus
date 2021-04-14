const BloodBank = require('../../models/bloodbank/bloodBank/profile'),
    {validationResult}  = require('express-validator');

//  @route /api/user/donateblood
// @desc get bloodBank list based on currrent location
// @access Private


const bloodbankinfo = async (req,res,next) => {
    let {lat,lang} = req.body;

    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()});
    // } 
    try{
        const bloodbank = await BloodBank.find({
            location:{
                $near:{
                    $geometry:{
                        type:"Point",
                        coordinates:[lat,lang]
                    },
                    $maxDistance: 50000
                }
            }
        });
        //console.log(bloodbank);
        return res.status(201).json(bloodbank);  
    }
    catch{
            console.error(err);
            return res.status(500).send('Server error');
        }
    }

//  @route /api/admin/bloodBank/:id
// @desc  get blood Bank info
// @access Private - admin access only
const getBloodBankById = async (req,res,next) =>{
    let bloodBank;
    try {
        bloodBank = await BloodBank.findById(req.params.id);
        if (!bloodBank) {
            return res.status(400).json({errors:[{msg : "Request not found!"}]});
        }
        return res.status(200).json(bloodBank);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.getBloodBankById=getBloodBankById;
exports.bloodbankinfo= bloodbankinfo;