const BillingRequest = require('../../models/bloodBank/request/billingRequestSchema'),
	Billing = require('../../models/bloodBank/billing/billingSchema'),
	Pricing = require('../../models/bloodBank/bloodBank/pricingSchema'),
	Booking = require('../../models/bloodBank/inventory/bookingSchema'),
	wbcSchema = require('../../models/bloodBank/storage/wbc-schema'),
	wholeSchema = require('../../models/bloodBank/storage/whole-schema'),
	cryoSchema = require('../../models/bloodBank/storage/cryo-schema'),
	ffpSchema = require('../../models/bloodBank/storage/ffp-schema'),
	plasmaSchema = require('../../models/bloodBank/storage/plasma-schema'),
	plateletSchema = require('../../models/bloodBank/storage/platelet-schema'),
	prbcSchema = require('../../models/bloodBank/storage/rbc-schema'),
	sagmSchema = require('../../models/bloodBank/storage/sagm-schema'),
	sdplasmaSchema = require('../../models/bloodBank/storage/sdplasma-schema'),
	moment = require('moment'),
	sdplateSchema = require('../../models/bloodBank/storage/sdplate-schema');

//  @route /api/bloodBank/billing
// @desc  get billing request
// @access Private
const getBillingRequests = async (req, res, next) => {
	try {
		const requests = await BillingRequest.find({
			bloodBank: req.bloodBank.id,
		})
			.populate('bookings')
			.populate('donor', ['profileImage', 'phone', 'name']);
		if (!requests) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}
		return res.status(200).json(requests);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodBank/billing/:id
// @desc  get billing request by id
// @access Private blood bank access only
const getRequestById = async (req, res, next) => {
	try {
		const request = await BillingRequest.findById(req.params.id)
			.populate('bookings')
			.populate('donor', ['profileImage', 'phone', 'name']);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital) {
			return res.status(400).json({ msg: 'Hospital request found!!!' });
		}
		const { hospitalName, patientName, age, bloodGroup, bookings, donor } =
			request;

		let bill = await Billing.findOne({ request: req.params.id });
		if (!bill) {
			const price = await Pricing.findOne({ bloodBank: req.bloodBank.id });
			bill = await new Billing({
				request: req.params.id,
				donor,
				bloodBank: req.bloodBank.id,
				issueDate: moment().format('DD-MM-YYYY'),
				hospitalName,
				patientName,
				age,
				bloodGroup,
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
			await bill.save();
		}
		return res.status(200).json({ request, bill });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodBank/billing/:id
// @desc  reject billing request
// @access Private blood bank access only
const rejectRequest = async (req, res, next) => {
	try {
		const request = await BillingRequest.findById(req.params.id).populate(
			'bookings'
		);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'Request not found!' }] });
		}
		const { bookings } = request;
		bookings.forEach(async (item) => {
			if (item.component == 'WBC') {
				const stock = await new wbcSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}

			if (item.component == 'WholeBlood') {
				const stock = await new wholeSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'Platelet') {
				const stock = await new plateletSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'Plasma') {
				const stock = await new plasmaSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'PRBC') {
				const stock = await new prbcSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'FFP') {
				const stock = await new ffpSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'Cryoprecipitate') {
				const stock = await new cryoSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'SPRBC') {
				const stock = await new sagmSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'SDPlate') {
				const stock = await new sdplateSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'SDPlasma') {
				const stock = await new sdplasmaSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			await Booking.findByIdAndDelete(item.id);
		});
		await request.delete();
		return res.status('200').json({ msg: 'Request Rejected!!' });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getBillingRequests = getBillingRequests;
exports.rejectRequest = rejectRequest;
exports.getRequestById = getRequestById;
