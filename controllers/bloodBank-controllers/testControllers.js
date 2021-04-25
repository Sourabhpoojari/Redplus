const  primarytestSchema = require('../../models/user/primarytestSchema'),
     BloodTestReport = require('../../models/user/bloodTestReportSchema'),
      Profile=require('../../models/user/profileSchema'),
      Donation = require('../../models/user/donationSchema'),
      {validationResult}  = require('express-validator');


//  @route /api/bloodbank/test/primarytest/:user_id
// @desc post primarytest info
// @access Private

const primarytest = async (req,res,next) => {
    let {weight,pulse,hb,bp,temp} = req.body;

    //console.log(weight);
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
            temp,
            bagnumber
        }
        primary = new primarytestSchema(data);
         await primary.save();
      let  donation = new Donation({
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

//  @route/api/bloodbank/test/bagNumber/:user_id
// @desc post bagnumber 
// @access Private - blood bank access only
const postBagNumber = async (req,res,next) =>{
    const {bagNumber} = req.body;
    let report;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    } 
    try {
        report = await BloodTestReport.findOne({bagNumber:bagNumber});
        if (report) {
            return res.status(302).json({errors:[{msg : "Bag number already exists!"}]});
        }
        report = await new BloodTestReport({
            user:req.params.user_id,
            bloodBank:req.bloodBank.id,
            bagNumber
        });
        await report.save();
        return  res.status(200).json({report});
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error'); 
    }
}



//  @route /api/bloodbank/bloodTestReport/
// @desc post bloodtest Report
// @access Private

const bloodtestreport = async(req,res,next)=>{
    const {typeOfBag,quantity,bgroup,batch,segNumber,expdate,rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,anyDiseases} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const data={
            user:req.params.user_id,
            bloodbank:req.bloodBank.id,
            typeOfBag,
            quantity,
            bgroup,
            batch,
            segNumber,
            expdate,
            rbcCount,
            wbcCount,
            plateCount,
            hemoglobinCount,
            hematocrit,
            bglucose,
            anyDiseases
    }
    testreport = new bloodTestReport(data);
    await testreport.save();
  return  res.status(200).send('Test Report is Generated');

    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

exports.bloodtestreport = bloodtestreport;
exports.primarytest = primarytest;
exports.postBagNumber = postBagNumber;