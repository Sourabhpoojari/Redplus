const bloodBank = require('../../models/bloodBank/bloodBank/bloodBank');
const Donation = require('../../models/user/donationSchema'),
TestReport = require('../../models/user/bloodTestReportSchema'),
PrimaryTest = require('../../models/user/primarytestSchema'),
BloodBankProfile = require('../../models/bloodbank/bloodBank/profile'),
moment = require('moment');

//  @route /api/user/testreport
// @desc get  of details of testreport
// @access Private to donor

const getDonations = async(req,res,next) =>{
    try{
        let donation = await Donation.find({user:req.user.id}).sort('-donatedOn');
        if(!donation){
            return res.status(400).json({msg:"Donation not found"});
        }

        // *********************
        //date formate
        //**********************
         // moment(donation.donatedOn).format('DD-MM-YYYY');
        

        // blood bank 
        
        console.log({bloodBank:donation[0].bloodBank});
        var bloodBankinfo = await BloodBankProfile.findOne({bloodBank:donation[0].bloodBank}).select('bloodBankName');
        console.log(bloodBankinfo);
        // blood = [];
        // async(req,res,next) => donation.forEach(item => {
        //     let date = await BloodBankProfile.findOne({bloodBank:item.bloodBank}).select('bloodBankName');
        //     blood.push(date);
        // }); 
        //var bloodBankinfo = await BloodBankProfile.find(donation.bloodbank);
       // console.log(bloodBankinfo);
        var donationdates=[];
        donation.forEach(item => {
            let date = moment(item.primaryTest.createdOn).format('DD-MM-YYYY');
            donationdates.push(date);
        });
        //console.log(typeof(donationdates));
        return res.status(200).json({donation,donationdates});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}


const getDonationsById = async(req,res,next) =>{
    try{
        let donation,bloodBankinfo,primaryTestinfo,TestReportinfo,date;
        donation = await Donation.findById(req.params.donation_id);
        if(!donation){
            return res.status(400).json({msg:"Donation not found"});
        }
        bloodBankinfo = await BloodBankProfile.findOne({bloodbank:donation.bloodbank});
        primaryTestinfo =await PrimaryTest.findOne({PrimaryTest:donation.PrimaryTest});
        TestReportinfo=await TestReport.findOne({BloodTestReport:donation.BloodTestReport});
        //let data =date.setDate(date.getDate());
        date = moment(primaryTestinfo.createdOn).format('DD-MM-YYYY');
   
    return res.status(200).json({Donation:donation,BloodBankInfo:bloodBankinfo, PrimaryTestInfo:primaryTestinfo,TestReportInfo:TestReportinfo,Donationdate:date});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}


exports.getDonations=getDonations;
exports.getDonationsById=getDonationsById;