const { findById } = require('../../models/user/healthInfoSchema');
const Health = require('../../models/user/healthInfoSchema'),
    Profile = require('../../models/user/profileSchema'),
    Donation = require('../../models/user/donationSchema');



//  @route /api/user/health/:user_id
// @desc post health info
// @access Private
const addHealthInfo = async (req,res,next) => {
    let {isDonated, date,  lastMeal, history, disease, consumptions, result, isPregnant, abortion, child, periods} = req.body;
    try {
        const profile = await Profile.findOne({user:req.user.id});
        if (profile.gender == 'Male'&& isPregnant ) {
            return res.status(422).send('You cannot be pregnant');   
        }
        // const d = date;
        date = new Date(date);
        lastMeal = new Date(lastMeal);
        console.log(lastMeal);
        const data = new Health({
            user:req.user_id,
            previousDonation:{
                isDonated,
                date
            },
            lastMeal,
            history,
            disease,
            consumptions,
            result,
            pregnant:{
                isPregnant,
                abortion,
                child,
                periods
            }
        });
        
        await data.save();
        if (history || disease || consumptions || isPregnant) {
            return res.status(422).send("You cannot donate blood");
        }
         
        
        date.setDate(date.getDate()+90);
        const current = new Date();
        if (current <= date) {
            return res.status(422).send("You cannot donate blood");
        }
        console.log(lastMeal.getHours());
    if (current <= lastMeal.getHours()+2 ) {
        return res.status(422).send("Please have some food");
    }

    return res.status(201).json(data);
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
}

//  @route /api/user/health/:user_id
// @desc get latest donation info
// @access Private
const getDonation = async (req,res,next) => {
    try {
        let previousDonation = await Donation.findById({user:req.params.user_id}).sort('-donaterOn');
        previousDonation = previousDonation[0];
        if (previousDonation) {
            return res.status(201).json({previousDonation});
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
}

exports.getDonation = getDonation;
exports.addHealthInfo = addHealthInfo;