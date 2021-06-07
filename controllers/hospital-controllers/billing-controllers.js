const { request } = require('express'),
         BillingRequest=require('../../models/bloodBank/request/billingRequestSchema'),
		 BloodBankProfile=require('../../models/bloodBank/bloodBank/profile'),
		 Pricing=require('../../models/bloodBank/bloodBank/pricingSchema'),
		 Billing=require('../../models/bloodBank/billing/billingSchema'),
		 moment =require('moment');

//  @route /api/hospital/billing
// @desc  get billing request
// @access Private
const getHospitalBillingRequests = async (req, res, next) => {
	try {
		const requests = await BillingRequest.find({
			hospital: req.hospital.id,
		}).populate('bookings');
        if(request.isHospital=='false'){
            return res.status(404).json({ errors: [{ msg: 'No Hospital requests found!' }] });
        }
		if (!requests) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}


		let i;
		const arr = [];

		for (i = 0; i < requests.length; i++) {
			const bloodBnakDetails = await BloodBankProfile.findOne({
				bloodBank: requests[i].bloodBank,
			});
			const billing = { requests: requests[i], bloodBnakDetails };
			arr.push(billing);
		}

		return res.status(200).json(arr);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/hospital/billing/:id
// @desc  get billing request by id
// @access Private to hospital Blood bank
const gethospitalBillingRequestById =async(req,res,next)=>{
	try{
		const request = await BillingRequest.findById(req.params.id)
			.populate('bookings');
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital=='false') {
			return res.status(400).json({ msg: 'No Hospital requests found!!!' });
		}
		
		const { hospitalName, patientName, age, bloodGroup, bookings} =
		request;
		
		let bill = await Billing.findOne({ request: req.params.id });
		if (!bill) {
			const profile = await BloodBankProfile.findOne({
				bloodBank: request.bloodBank,
			});
			const price = await Pricing.findOne({ bloodBank: request.bloodBank});
			bill = await new Billing({
				request: req.params.id,
				hospital:req.hospital.id,
				bloodBank:request.bloodBank,
				issueDate: moment().format('DD-MM-YYYY'),
				hospitalName,
				patientName,
				age,
				bloodGroup,
				bloodBankProfile: profile.id,
			});
			let sum = 0;
			bookings.forEach((item) => {
				const data = {
					component: item.component,
					expiryDate: item.expiryDate,
					bagNumber: item.bagNumber,
				};
				if (item.component == 'WBC') {
					data.price = price.WBC;
					sum += price.WBC;
				}
				if (item.component == 'WholeBlood') {
					data.price = price.WholeBlood;
					sum += price.WholeBlood;
				}
				if (item.component == 'Platelet') {
					data.price = price.Platelet;
					sum += price.WBC;
				}
				if (item.component == 'Plasma') {
					data.price = price.Plasma;
					sum += price.Plasma;
				}
				if (item.component == 'PRBC') {
					data.price = price.PRBC;
					sum += price.PRBC;
				}
				if (item.component == 'FFP') {
					data.price = price.FFP;
					sum += price.FFP;
				}
				if (item.component == 'Cryoprecipitate') {
					data.price = price.Cryoprecipitate;
					sum += price.Cryoprecipitate;
				}
				if (item.component == 'SPRBC') {
					data.price = price.SPRBC;
					sum += price.SPRBC;
				}
				if (item.component == 'SDPlatele') {
					data.price = price.SDPlatele;
					sum += price.SDPlatele;
				}
				if (item.component == 'SDPlasma') {
					data.price = price.SDPlasma;
					sum += price.SDPlasma;
				}
				bill.components.push(data);
			});
			bill.subTotal = sum;
			bill.grandTotal = sum;
			bill.isHospital=true;
			request.status=false;
			await request.save();
			await bill.save();
			
		}
		const bprofile = await BloodBankProfile.findOne({
			bloodBank: request.bloodBank,
		});
		return res.status(200).json({ request, bill,bprofile });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getHospitalBillingRequests=getHospitalBillingRequests;
exports.gethospitalBillingRequestById=gethospitalBillingRequestById;