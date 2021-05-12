const  primarytestSchema = require('../../models/user/primarytestSchema'),
     BloodTestReport = require('../../models/user/bloodTestReportSchema'),
      Profile=require('../../models/user/profileSchema'),
      Donation = require('../../models/user/donationSchema'),
      {validationResult}  = require('express-validator'),
      jwt = require('jsonwebtoken'),
      config = require('config'),
      WHOLE = require('../../models/bloodBank/storage/whole-schema'),
      CRYOPRI = require('../../models/bloodBank/storage/cryo-schema'),
      FFP =require('../../models/bloodBank/storage/ffp-schema'),
      PLASMA = require('../../models/bloodBank/storage/plasma-schema'),
      PLATELET = require('../../models/bloodBank/storage/platelet-schema'),
      RBC = require('../../models/bloodBank/storage/rbc-schema'),
      SAGM = require('../../models/bloodBank/storage/sagm-schema'),
      SDPLASMA = require('../../models/bloodBank/storage/sdplasma-schema') ,
      SDPLATE = require('../../models/bloodBank/storage/sdplate-schema'),
      WBC = require('../../models/bloodBank/storage/wbc-schema'),
      moment = require('moment'),
      Inventory = require('../../models/bloodBank/inventory/inventorySchema');

//  @route /api/bloodbank/test/primarytest/:user_id
// @desc post primarytest info
// @access Private

const primaryTest = async (req,res,next) => {
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

// ###################
// Component functions
// ###################
const whole = async (req,res,report,bgroup,batch,segNumber, credits)=>{
    let component, inventory;
    try {
        component = await WHOLE.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new WHOLE({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(35,'days');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                wholeBlood : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'35d'
            }
        );
                // update inventory
            inventory = await Inventory.findOne({bloodBankID:req.bloodBank.id});
            if (!inventory) {
                // create inventory
                inventory = new Inventory({
                    bloodBankID:req.bloodBank.id  
                });
            }
            // credit points -  add blood group credits
            if (bgroup == 'A+Ve') {
                credits+= 50;
                inventory.whole['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 80;
                inventory.whole['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=80;
                inventory.whole['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 90;
                inventory.whole['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 90;
                inventory.whole['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.whole['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.whole['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 70;
                inventory.whole['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const platelet = async (report,bgroup,batch,segNumbe) =>{

}

// ###################
// Get test Credits
// ###################
const testCredit = async (rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,bp,gender,credits) => {
    try {
        
    } catch (err) {
        console.error(err.message);
    }
}

// Update Inventory - bloodGroup functions
// OOPS this didn't work well cannot determine component
// const aPos = async (req,res) => {
//        // update inventory
//        inventory = await Inventory.findOne({bloodBankID:req.bloodBank.id});
//        if (!inventory) {
//            // create inventory
//            inventory = new Inventory({
//                bloodBankID:req.bloodBank.id  
//            });
//        }

// }

//  @route /api/bloodbank/test/bloodTestReport/:bagNumber
// @desc post bloodtest Report
// @access Private

const testReportAndCredits = async (req,res,next)=>{
    let {bgroup,batch,segNumber,components,rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,bp,diseases} = req.body;
    rbcCount = parseFloat(rbcCount);
    wbcCount = parseFloat(wbcCount);
    plateCount = parseFloat(plateCount);
    hemoglobinCount = parseFloat(hemoglobinCount);
    hematocrit = parseFloat(hematocrit);
    bglucose = parseFloat(bglucose);
    bp = parseFloat(bp);
    const bagNumber = req.params.bagNumber;

    // Error validations
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let report,credits=0;
    try{
        report = await BloodTestReport.findOne({bagNumber,bloodBank:req.bloodBank.id});
        if (!report) {
            return res.status(302).json({errors:[{msg : "Bag number do not exist!"}]});
        }
        // if (report.bloodBank != req.bloodBank.id) {
        //     return res.status(302).json({errors:[{msg : "OOPS Invalid Bag Number!"}]});
        // }
        if (!components) {
            return res.status(302).json({errors:[{msg : "Component is required!"}]});
        }
        // credit points  - component credits and get blood group credits
        // update inventory and add storage stock
        components.forEach(component => {
            if (component == "WholeBlood") {
                credits = 18;
                credits =   whole(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'Platelet') {
                credits = 18;
                credits =  platelet(report,bgroup,batch,segNumber,credits);
            }
        });
        //  ##################
        // credit points- test results
        // ###################
        const {gender} = await Profile.findOne({user:report.user}).select('gender');
        credits = testCredit(rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,bp,gender,credits);
        // RBC count result
  




        if (!diseases && diseases.length == 0) {
            credits+= 25;
        }
        // add expiry for credits 









  
        const data={
            bgroup,
            batch,
            segNumber,
            rbcCount,
            wbcCount,
            plateCount,
            hemoglobinCount,
            hematocrit,
            bglucose,
            bp,
            diseases
    }
    // blood group functions
    testreport = new bloodTestReport(data);
    await testreport.save();
  return  res.status(200).send('Test Report is Generated');

    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

exports.testReportAndCredits = testReportAndCredits;
exports.primaryTest = primaryTest;
exports.postBagNumber = postBagNumber;