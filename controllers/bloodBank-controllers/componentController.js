const wbcSchema = require('../../models/bloodBank/storage/wbc-schema'),
	wholeSchema = require('../../models/bloodBank/storage/whole-schema'),
	cryoSchema = require('../../models/bloodBank/storage/cryo-schema'),
	ffpSchema = require('../../models/bloodBank/storage/ffp-schema'),
	plasmaSchema = require('../../models/bloodBank/storage/plasma-schema'),
	plateletSchema = require('../../models/bloodBank/storage/platelet-schema'),
	prbcSchema = require('../../models/bloodBank/storage/rbc-schema'),
	sagmSchema = require('../../models/bloodBank/storage/sagm-schema'),
	sdplasmaSchema = require('../../models/bloodBank/storage/sdplasma-schema'),
	sdplateSchema = require('../../models/bloodBank/storage/sdplate-schema');

//  @route /api/bloodBank/components/:component/:bgroup
// @desc get components
// @access Private - BloodBank access only
const getComponents = async (req, res, next) => {
	try {
		const { component, bgroup } = req.params;
		if (component == 'WholeBlood') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await wholeSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await wholeSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'Platelet') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await plateletSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await plateletSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'WBC') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await wbcSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await wbcSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'Plasma') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await plasmaSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await plasmaSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'PRBC') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await prbcSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await prbcSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'FFP') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await ffpSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await ffpSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'Cryoprecipitate') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await cryoSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await cryoSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'SPRBC') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await sagmSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await sagmSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'SDPlatelet') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await sdplateSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await sdplateSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		if (component == 'SDPlasma') {
			if (bgroup == 'AllBloodGroups') {
				const stock = await sdplasmaSchema.find({
					bankID: req.bloodBank.id,
				});
				return res.status(201).json(stock);
			}
			const stock = await sdplasmaSchema.find({
				bankID: req.bloodBank.id,
				group: bgroup,
			});
			return res.status(201).json(stock);
		}
		return res.status(404).json({ errors: [{ msg: 'No Components Found!' }] });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getComponents = getComponents;
