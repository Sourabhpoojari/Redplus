const Pricing = require('../../models/bloodBank/bloodBank/pricingSchema');

//  @route /api/bloodbank/prcing Get
// @desc get prcing of Blood Component
// @access Private to blood bank

const getPricing = async (req, res, next) => {
	try {
		const pricing = await Pricing.findOne({ bloodBank: req.bloodBank.id });
		if (!pricing) {
			return res.status(400).json({ msg: 'No pricing found!' });
		}

		return res.status(200).json(pricing);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodbank/pricing POST
// @desc careaate and update prcing of Blood Component
// @access Private to blood bank
const createandupdatePricing = async (req, res, next) => {
	const {
		WBC,
		WholeBlood,
		Platelet,
		Plasma,
		PRBC,
		FFP,
		Cryoprecipitate,
		SPRBC,
		SDPlatele,
		SDPlasma,
	} = req.body;
	try {
		const data = {
			WBC,
			WholeBlood,
			Platelet,
			Plasma,
			PRBC,
			FFP,
			Cryoprecipitate,
			SPRBC,
			SDPlatele,
			SDPlasma,
		};

		let pricing = await Pricing.findOne({ bloodBank: req.bloodBank.id });

		if (pricing) {
			pricing = await Pricing.findOneAndUpdate(
				{ bloodBank: req.bloodBank.id },
				{ $set: data },
				{ new: true }
			);
			return res.status(200).json(pricing);
		}
		pricing = new Pricing(data);
		await pricing.save();
		return res.json(pricing);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error');
	}
};

exports.createandupdatePricing = createandupdatePricing;
exports.getPricing = getPricing;
