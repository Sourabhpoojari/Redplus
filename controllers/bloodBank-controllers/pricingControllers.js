const Pricing = require('../../models/bloodbank/bloodBank/pricingSchema');



//  @route /api/bloodbank/prcing Get
// @desc get prcing of Blood Component
// @access Private to blood bank

const getPricing = async(req,res,next) =>{  
    try{
        console.log( req.bloodBank.id);
    let pricing = await Pricing.findOne({bloodBank:req.bloodBank.id});
    if(!pricing){
        return res.status(400).json({ msg: 'No pricing found!' });
    }

    return res.json(pricing);
    }
    catch(err){
        console.error(err.message);
		return res.status(500).send('Server error');
    }
}

//  @route /api/bloodbank/pricing POST
// @desc careaate and update prcing of Blood Component
// @access Private to blood bank
const createandupdatePricing = async(req,res,next) =>{
    let {wbc,whole,platelet,plasma,prbc,ffp,cryo,sprbc,sdplatelet,sdplasma} = req.body;
    let pricing;
	try {
		const data = {
			bloodBank: req.bloodBank.id,
			wbc,
            whole,
            platelet,
            plasma,
            prbc,
            ffp,
            cryo,
            sprbc,
            sdplatelet,
            sdplasma
		};
        //console.log(pricingFields);
        pricing = await Pricing.findOne({bloodBank: req.bloodBank.id });
        console.log(pricing);
		if (pricing) {
			pricing = await Pricing.findOneAndUpdate(
				{ bloodBank: req.bloodBank.id },
				{ $set: data },
				{ new: true }
			);
			return res.json(pricing);
		}
		pricing = new Pricing(data);
		await pricing.save();
        return res.json(pricing);
    }
    catch(err){
        console.error(err.message);
		return res.status(500).send('Server error');
    }
}


exports.createandupdatePricing = createandupdatePricing;
exports.getPricing = getPricing;