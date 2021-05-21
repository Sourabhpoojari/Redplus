const bloodBank = require('../../models/bloodBank/bloodBank/bloodBank');
const Donation = require('../../models/user/donationSchema'),
TestReport = require('../../models/user/bloodTestReportSchema'),
PrimaryTest = require('../../models/user/primarytestSchema'),
BloodBankProfile = require('../../models/bloodbank/bloodBank/profile');

//  @route /api/user/testreport
// @desc get  of details of testreport
// @access Private to donor

const getDonations = async(req,res,next) =>{
    try{
        let donation = await Donation.find({user:req.user.id}).sort('donatedOn').populate('bloodBank',['email']);
        //console.log(donation);

        console.log(donation[0].donatedOn);
        console.log(await BloodBankProfile.findOne(donation[0].bloodBank).select('bloodBankName'));
        console.log(await PrimaryTest.findOne(donation.primaryTest));
        if(!donation){
            return res.status(400).json({msg:"Donation not found"});
        }
        
        
        return res.status(200).json(donation);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}


const getDonationsById = async(req,res,next) =>{
    console.log(req.params.donation_id);
    let donation = await Donation.findById(req.params.donation_id);
    console.log(donation.bloodBank);
    console.log(await BloodBankProfile.findById(donation.bloodBank));
}


exports.getDonations=getDonations;
exports.getDonationsById=getDonationsById;