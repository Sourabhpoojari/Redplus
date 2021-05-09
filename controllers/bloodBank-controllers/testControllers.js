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
            temp
        }
        primary = new primarytestSchema(data);
         await primary.save();
      const  donation = new Donation({
            bloodBank:req.bloodBank.id,
            user:req.params.user_id,
            primaryTest:primary.id
        });
        await  donation.save();
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
                credits+= 55;
                inventory.whole['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.whole['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.whole['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.whole['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
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
                credits+= 85;
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

const platelet = async (req,res,report,bgroup,batch,segNumber, credits) =>{
    let component, inventory;
    try {
        component = await PLATELET.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new PLATELET({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(5,'days');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                platelet : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'5d'
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
                inventory.platelet['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.platelet['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.platelet['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.platelet['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.platelet['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.platelet['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.platelet['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.platelet['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const wbc = async (req,res,report,bgroup,batch,segNumber,credits) => {
    let component, inventory;
    try {
        component = await WBC.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new WBC({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(42,'days');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                wbc : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'42d'
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
                inventory.wbc['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.wbc['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.wbc['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.wbc['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.wbc['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.wbc['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.wbc['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.wbc['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const plasma = async (req,res,report,bgroup,batch,segNumber,credits) => {
    let component, inventory;
    try {
        component = await PLASMA.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new PLASMA({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(1,'year');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                plasma : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'1y'
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
                inventory.plasma['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.plasma['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.plasma['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.plasma['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.plasma['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.plasma['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.plasma['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.plasma['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const prbc = async (req,res,report,bgroup,batch,segNumber,credits) =>{
    let component, inventory;
    try {
        component = await RBC.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new RBC({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(42,'days');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                rbc : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'42d'
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
                inventory.rbc['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.rbc['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.rbc['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.rbc['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.rbc['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.rbc['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.rbc['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.rbc['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const ffp = async (req,res,report,bgroup,batch,segNumber,credits) => {
    let component, inventory;
    try {
        component = await FFP.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new FFP({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(1,'year');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                ffp : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'1y'
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
                inventory.ffp['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.ffp['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.ffp['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.ffp['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.ffp['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.ffp['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.ffp['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.ffp['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const cryo = async (req,res,report,bgroup,batch,segNumber,credits) =>{
    let component, inventory;
    try {
        component = await CRYOPRI.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new CRYOPRI({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(1,'year');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                cryo : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'1y'
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
                inventory.cryo['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.cryo['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.cryo['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.cryo['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.cryo['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.cryo['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.cryo['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.cryo['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const sprbc = async (req,res,report,bgroup,batch,segNumber,credits) =>{
    let component, inventory;
    try {
        component = await SAGM.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new SAGM({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(1,'year');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                sagm : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'1y'
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
                inventory.sagm['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.sagm['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.sagm['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.sagm['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.sagm['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.sagm['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.sagm['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.sagm['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

const sdplate = async (req,res,report,bgroup,batch,segNumber,credits) =>{
    let component, inventory;
    try {
        component = await SDPLATE.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new SDPLATE({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(5,'days');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                sdplate : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'5d'
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
                inventory.sdplate['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.sdplate['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.sdplate['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.sdplate['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.sdplate['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.sdplate['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.sdplate['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.sdplate['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }  
}

const sdplasma = async (req,res,report,bgroup,batch,segNumber,credits) =>{
    let component, inventory;
    try {
        component = await SDPLASMA.findOne({batch,segment:segNumber});
        if (component) {
            return res.status(302).json({errors:[{msg : "Component with this Segment Number already exist!"}]});
        }
        component = await new SDPLASMA({
            bankID:req.bloodBank.id,
            donor : report.user,
            group:bgroup,
            batch,
            segment:segNumber
        });

        // moment
        component.duration = moment.duration(1,'year');
        // assign expiry ticket
        component.ticket =  jwt.sign(
            {
                sdplasma : {
                    id : component.id
                }
            },
            config.get('STOCKSECRET'),
            {
                expiresIn:'1y'
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
                inventory.sdplasma['A+Ve']+= 1 ;
            }
            if (bgroup == 'A-Ve') {
                credits+= 90;
                inventory.sdplasma['A-Ve']+= 1 ;
            }
            if (bgroup == 'B+Ve') {
                credits+=45;
                inventory.sdplasma['B+Ve']+= 1 ;
            }
            if (bgroup == 'B-Ve') {
                credits+= 85;
                inventory.sdplasma['B-Ve']+= 1 ;
            }
            if (bgroup == 'AB+Ve') {
                credits+= 70;
                inventory.sdplasma['A+Ve']+= 1 ;
            }
            if (bgroup == 'AB-Ve') {
                credits+= 100;
                inventory.sdplasma['AB+Ve']+= 1 ;
            }
            if (bgroup == 'O+Ve') {
                credits+= 40;
                inventory.sdplasma['O+Ve']+= 1 ;
            }
            if (bgroup == 'O-Ve') {
                credits+= 85;
                inventory.sdplasma['O-Ve']+= 1 ;
            }
        
        await inventory.save();
        await component.save();
        return credits;

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    } 
}
// ###################
// Get test Credits
// ###################
const testCredit = async (rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,diastolic,systrolic,gender,credits) => {
    try {
        if (gender == "male") {
            if (4.7<rbcCount<6.1 ) {
                credits+=25;
            }
            if (4.5<wbcCount<11) {
                credits+=25;
            }
            if (13.5<hemoglobinCount<17.5 ) {
                credits+=25;
            }
            if (41<hematocrit<50) {
                credits+=25;
            }      
        }
        if (gender == 'female') {
            if (4.2<rbcCount<5.4) {
                credits+=25;
            }
            if (4.5<wbcCount<11) {
                credits+=25;
            }
            if (12<hemoglobinCount<15.5) {
                credits+=25;
            }
            if (36<hematocrit<48) {
                credits+=25;
            }
        }
        if (150000<plateCount<450000) {
            credits+=25;
        }
        if (bglucose == 140) {
            credits+=25;
        }
        if (diastolic == 80 && systrolic == 120) {
            credits+=25;
        }
        return credits;

    } catch (err) {
        console.error(err.message);
    }
}

//  @route /api/bloodbank/test/bloodTestReport/:bagNumber
// @desc post bloodtest Report
// @access Private

const testReportAndCredits = async (req,res,next)=>{
    let {bgroup,batch,segNumber,components,rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,systrolic,diastolic,diseases} = req.body;
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
        // ################
        // credit points  - component credits and get blood group credits
        //  ###############
        // update inventory and add storage stock
        components.forEach(component => {
            if (component == "WholeBlood") {
                credits = 20;
                credits =   whole(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'Platelet') {
                credits = 20;
                credits =  platelet(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'WBC') {
                credits = 20;
                credits =  wbc(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'Plasma') {
                credits = 20;
                credits =  plasma(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'PRBC') {
                credits = 20;
                credits =  prbc(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'FFP') {
                credits = 20;
                credits =  ffp(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'Cryoprecipitate') {
                credits = 20;
                credits =  cryo(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'SPRBC') {
                credits = 20;
                credits =  sprbc(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'SDPlatelet') {
                credits = 20;
                credits =  sdplate(req,res,report,bgroup,batch,segNumber,credits);
            }
            if (component === 'SDPlasma') {
                credits = 20;
                credits =  sdplasma(req,res,report,bgroup,batch,segNumber,credits);
            }
        });
        //  ##################
        // credit points- test results
        // ###################
        const {gender} = await Profile.findOne({user:report.user}).select('gender');
        credits = testCredit(rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,diastolic,systrolic,gender,credits);
        // RBC count result
        if (!diseases && diseases.length == 0) {
            credits+= 25;
        }
        // get latest donationSchema
        const donationArray = await Donation.find({user:report.user, bloodBank:req.bloodBank.id}).sort('-donatedOn'),
        donation = donationArray[0];
        donation.credits = credits;
        // add expiry for credits 
        donation.expiryTicket =  jwt.sign(
            {
                credit : {
                    id : donation.id
                }
            },
            config.get('CREDITSECRET'),
            {
                expiresIn:'180d'
            }
        );
        // add duration
        donation.creditDuration =  moment.duration(180,'days');

    // ###########
    // save Test report
    // ###########
    report.bgroup = bgroup;
    report.rbcCount = rbcCount;
    report.wbcCount = wbcCount;
    report.plateCount = plateCount;
    report.hemoglobinCount = hemoglobinCount;
    report.hematocrit = hematocrit;
    report.bglucose = bglucose;
    report.bp.systrolic = systrolic;
    report.bp.diastolic = diastolic;
    report.diseases = diseases;
    await report.save();
    donation.report = report.id;
    await donation.save();

  return  res.status(200).json(report);

    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}

exports.testReportAndCredits = testReportAndCredits;
exports.primaryTest = primaryTest;
exports.postBagNumber = postBagNumber;