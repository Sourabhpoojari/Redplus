const BloodBank = require('../../models/bloodBank/bloodBank/profile'),
	UserLocation = require('../../models/user/donorlocationSchema'),
	Inventory = require('../../models/bloodBank/inventory/inventorySchema'),
	BloodRequest = require('../../models/user/bloodRequestFormSchema'),
	{ validationResult } = require('express-validator'),
	Profile = require('../../models/user/profileSchema'),
	moment = require('moment');

//  @route /api/user/findblood
// @desc get bloodBank list based on currrent location
// @access Private

const getnearbybloodBank = async (req, res, next) => {
	const { location } = await UserLocation.findOne({ user: req.user.id }).select(
		'location'
	);
	const lat = location.coordinates[0];
	lang = location.coordinates[1];
	try {
		let bloodBank = await BloodBank.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 50000,
					spherical: true,
				},
			},
		]);
		bloodBank.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});

		return res.status(200).json(bloodBank);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/user/findblood/:component/:bgroup
// @desc get bloodBank list based on currrent location with blood available status
// @access Private
const getBloodBlanks = async (req, res, next) => {
	const { component, bgroup } = req.params;
	try {
		const { location } = await UserLocation.findOne({
			user: req.user.id,
		}).select('location');

		const lat = location.coordinates[0],
			lang = location.coordinates[1];
		let bloodBank = await BloodBank.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 50000,
					spherical: true,
				},
			},
		]);
		let arr = [...bloodBank];
		let inventory;
		let i;
		for (i = 0; i < arr.length; i++) {
			arr[i].distance = parseFloat(arr[i].distance / 1000).toFixed(2);
			inventory = await Inventory.findOne({
				bloodBankID: arr[i].bloodBank,
			});
			if (component == 'WholeBlood') {
				i = whole(arr, i, bgroup, inventory);
			}
			if (component == 'Platelet') {
				i = platelet(arr, i, bgroup, inventory);
			}
			if (component == 'WBC') {
				i = wbc(arr, i, bgroup, inventory);
			}
			if (component == 'Plasma') {
				i = plasma(arr, i, bgroup, inventory);
			}
			if (component == 'PRBC') {
				i = prbc(arr, i, bgroup, inventory);
			}
			if (component == 'FFP') {
				i = ffp(arr, i, bgroup, inventory);
			}
			if (component == 'Cryoprecipitate') {
				i = cryo(arr, i, bgroup, inventory);
			}
			if (component == 'SPRBC') {
				i = sprbc(arr, i, bgroup, inventory);
			}
			if (component == 'SDPlatelet') {
				i = sdplatelet(arr, i, bgroup, inventory);
			}
			if (component == 'SDPlasma') {
				i = sdplasma(arr, i, bgroup, inventory);
			}
		}
		if (arr.length == 0) {
			return res.status(200).json(bloodBank);
		}
		return res.status(200).json(arr);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

// COMPONENT FUNCTIONS
const whole = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.whole['A+Ve'],
			'A-Ve': inventory.whole['A-Ve'],
			'AB+Ve': inventory.whole['AB+Ve'],
			'AB-Ve': inventory.whole['AB-Ve'],
			'B+Ve': inventory.whole['B+Ve'],
			'B-Ve': inventory.whole['B-Ve'],
			'O+Ve': inventory.whole['O+Ve'],
			'O-Ve': inventory.whole['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.whole['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.whole['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.whole['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.whole['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.whole['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.whole['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.whole['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.whole['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.whole['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.whole['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.whole['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.whole['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.whole['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.whole['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.whole['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.whole['0-Ve'],
			};
		}
	}
	return i;
};

const platelet = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.platelet['A+Ve'],
			'A-Ve': inventory.platelet['A-Ve'],
			'AB+Ve': inventory.platelet['AB+Ve'],
			'AB-Ve': inventory.platelet['AB-Ve'],
			'B+Ve': inventory.platelet['B+Ve'],
			'B-Ve': inventory.platelet['B-Ve'],
			'O+Ve': inventory.platelet['O+Ve'],
			'O-Ve': inventory.platelet['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.platelet['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.platelet['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.platelet['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.platelet['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.platelet['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.platelet['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.platelet['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.platelet['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.platelet['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.platelet['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.platelet['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.platelet['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.platelet['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.platelet['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.platelet['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.platelet['0-Ve'],
			};
		}
	}
	return i;
};

const wbc = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.wbc['A+Ve'],
			'A-Ve': inventory.wbc['A-Ve'],
			'AB+Ve': inventory.wbc['AB+Ve'],
			'AB-Ve': inventory.wbc['AB-Ve'],
			'B+Ve': inventory.wbc['B+Ve'],
			'B-Ve': inventory.wbc['B-Ve'],
			'O+Ve': inventory.wbc['O+Ve'],
			'O-Ve': inventory.wbc['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.wbc['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.wbc['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.wbc['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.wbc['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.wbc['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.wbc['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.wbc['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.wbc['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.wbc['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.wbc['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.wbc['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.wbc['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.wbc['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.wbc['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.wbc['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.wbc['0-Ve'],
			};
		}
	}
	return i;
};

const plasma = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.plasma['A+Ve'],
			'A-Ve': inventory.plasma['A-Ve'],
			'AB+Ve': inventory.plasma['AB+Ve'],
			'AB-Ve': inventory.plasma['AB-Ve'],
			'B+Ve': inventory.plasma['B+Ve'],
			'B-Ve': inventory.plasma['B-Ve'],
			'O+Ve': inventory.plasma['O+Ve'],
			'O-Ve': inventory.plasma['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.plasma['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.plasma['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.plasma['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.plasma['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.plasma['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.plasma['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.plasma['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.plasma['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.plasma['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.plasma['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.plasma['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.plasma['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.plasma['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.plasma['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.plasma['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.plasma['0-Ve'],
			};
		}
	}
	return i;
};

const prbc = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.rbc['A+Ve'],
			'A-Ve': inventory.rbc['A-Ve'],
			'AB+Ve': inventory.rbc['AB+Ve'],
			'AB-Ve': inventory.rbc['AB-Ve'],
			'B+Ve': inventory.rbc['B+Ve'],
			'B-Ve': inventory.rbc['B-Ve'],
			'O+Ve': inventory.rbc['O+Ve'],
			'O-Ve': inventory.rbc['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.rbc['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.rbc['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.rbc['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.rbc['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.rbc['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.rbc['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.rbc['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.rbc['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.rbc['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.rbc['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.rbc['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.rbc['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.rbc['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.rbc['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.rbc['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.rbc['0-Ve'],
			};
		}
	}
	return i;
};
const ffp = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.ffp['A+Ve'],
			'A-Ve': inventory.ffp['A-Ve'],
			'AB+Ve': inventory.ffp['AB+Ve'],
			'AB-Ve': inventory.ffp['AB-Ve'],
			'B+Ve': inventory.ffp['B+Ve'],
			'B-Ve': inventory.ffp['B-Ve'],
			'O+Ve': inventory.ffp['O+Ve'],
			'O-Ve': inventory.ffp['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.ffp['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.ffp['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.ffp['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.ffp['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.ffp['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.ffp['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.ffp['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.ffp['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.ffp['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.ffp['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.ffp['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.ffp['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.ffp['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.ffp['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.ffp['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.ffp['0-Ve'],
			};
		}
	}
	return i;
};
const cryo = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.cryo['A+Ve'],
			'A-Ve': inventory.cryo['A-Ve'],
			'AB+Ve': inventory.cryo['AB+Ve'],
			'AB-Ve': inventory.cryo['AB-Ve'],
			'B+Ve': inventory.cryo['B+Ve'],
			'B-Ve': inventory.cryo['B-Ve'],
			'O+Ve': inventory.cryo['O+Ve'],
			'O-Ve': inventory.cryo['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.cryo['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.cryo['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.cryo['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.cryo['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.cryo['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.cryo['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.cryo['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.cryo['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.cryo['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.cryo['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.cryo['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.cryo['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.cryo['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.cryo['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.cryo['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.cryo['0-Ve'],
			};
		}
	}
	return i;
};
const sprbc = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.sagm['A+Ve'],
			'A-Ve': inventory.sagm['A-Ve'],
			'AB+Ve': inventory.sagm['AB+Ve'],
			'AB-Ve': inventory.sagm['AB-Ve'],
			'B+Ve': inventory.sagm['B+Ve'],
			'B-Ve': inventory.sagm['B-Ve'],
			'O+Ve': inventory.sagm['O+Ve'],
			'O-Ve': inventory.sagm['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.sagm['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.sagm['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.sagm['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.sagm['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.sagm['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.sagm['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.sagm['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.sagm['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.sagm['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.sagm['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.sagm['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.sagm['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.sagm['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.sagm['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.sagm['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.sagm['0-Ve'],
			};
		}
	}
	return i;
};
const sdplatelet = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.sdplate['A+Ve'],
			'A-Ve': inventory.sdplate['A-Ve'],
			'AB+Ve': inventory.sdplate['AB+Ve'],
			'AB-Ve': inventory.sdplate['AB-Ve'],
			'B+Ve': inventory.sdplate['B+Ve'],
			'B-Ve': inventory.sdplate['B-Ve'],
			'O+Ve': inventory.sdplate['O+Ve'],
			'O-Ve': inventory.sdplate['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.sdplate['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.sdplate['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.sdplate['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.sdplate['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.sdplate['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.sdplate['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.sdplate['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.sdplate['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.sdplate['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.sdplate['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.sdplate['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.sdplate['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.sdplate['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.sdplate['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.sdplate['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.sdplate['0-Ve'],
			};
		}
	}
	return i;
};
const sdplasma = (arr, i, bgroup, inventory) => {
	if (bgroup == 'AllBloodGroups') {
		arr[i].inventory = {
			'A+Ve': inventory.sdplasma['A+Ve'],
			'A-Ve': inventory.sdplasma['A-Ve'],
			'AB+Ve': inventory.sdplasma['AB+Ve'],
			'AB-Ve': inventory.sdplasma['AB-Ve'],
			'B+Ve': inventory.sdplasma['B+Ve'],
			'B-Ve': inventory.sdplasma['B-Ve'],
			'O+Ve': inventory.sdplasma['O+Ve'],
			'O-Ve': inventory.sdplasma['O-Ve'],
		};
	}
	if (bgroup == 'A+Ve') {
		if (inventory.sdplasma['A+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A+Ve': inventory.sdplasma['A+Ve'],
			};
		}
	}
	if (bgroup == 'A-Ve') {
		if (inventory.sdplasma['A-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'A-Ve': inventory.sdplasma['A-Ve'],
			};
		}
	}
	if (bgroup == 'AB+Ve') {
		if (inventory.sdplasma['AB+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB+Ve': inventory.sdplasma['AB+Ve'],
			};
		}
	}
	if (bgroup == 'AB-Ve') {
		if (inventory.sdplasma['AB-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'AB-Ve': inventory.sdplasma['AB-Ve'],
			};
		}
	}
	if (bgroup == 'B+Ve') {
		if (inventory.sdplasma['B+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B+Ve': inventory.sdplasma['B+Ve'],
			};
		}
	}
	if (bgroup == 'B-Ve') {
		if (inventory.sdplasma['B-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'B-Ve': inventory.sdplasma['B-Ve'],
			};
		}
	}
	if (bgroup == '0+Ve') {
		if (inventory.sdplasma['0+Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0+Ve': inventory.sdplasma['0+Ve'],
			};
		}
	}
	if (bgroup == '0-Ve') {
		if (inventory.sdplasma['0-Ve'] < 1) {
			arr.splice(i, 1);
			i--;
		} else {
			arr[i].inventory = {
				'0-Ve': inventory.sdplasma['0-Ve'],
			};
		}
	}
	return i;
};

//  @route /api/user/findblood/bloodrequest/:req_id
// @desc post user getprofile
// @access Private

const bloodRequestForm = async (req, res, next) => {
	try {
		const {
			pateintName,
			hospitalName,
			age,
			bloodGroup,
			wbc,
			wholeBlood,
			platelet,
			plasma,
			sdPlatlet,
			prbc,
			ffp,
			cryo,
			sprbc,
			sdPlasma,
		} = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		let profile = await Profile.findOne({ donor: req.user.id });
		if (!profile) {
			return res.status(422).send('Please compleate your Profile');
		}
		let request;
		//console.log({donor:req.user});
		request = await new BloodRequest({
			donor: req.user.id,
			bloodBank: req.params.req_id,
			RequestDate: moment().format('DD-MM-YYYY'),
			pateintName,
			hospitalName,
			age,
			bloodGroup,
			wbc,
			wholeBlood,
			platelet,
			plasma,
			sdPlatlet,
			prbc,
			ffp,
			cryo,
			sprbc,
			sdPlasma,
		});

		let find = await BloodRequest.find({ donor: req.user.id });

		if (find) {
			return res.status(422).send('Your Request is Already sent');
		}
		request.save();
		return res.status(200).json(request);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getnearbybloodBank = getnearbybloodBank;
exports.getBloodBlanks = getBloodBlanks;
exports.bloodRequestForm = bloodRequestForm;
