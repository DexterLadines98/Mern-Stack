const Discount = require("../models/Discount");

// Create discount (admin only)
module.exports.createDiscount = async (discountInfo) => {
	const discountFound = await Discount.findOne({ name: discountInfo.name })
		.then((discount) => {
			if (discount) return true;
			else return false;
		})
		.catch(() => {
			return true;
		});

	if (discountFound) {
		return { message: "discount already exists" };
	} else {
		let newDiscount = new Discount(discountInfo);

		return newDiscount
			.save()
			.then(() => {
				return { message: "discount created" };
			})
			.catch((err) => err.message);
	}
};

// Retrieve discounts (admin only)
module.exports.getDiscounts = () => {
	return Discount.find({})
		.then((result) => result)
		.catch((err) => err.message);
};

// Retrieve active discounts
module.exports.getActiveDiscounts = () => {
	return Discount.find({ isActive: true })
		.then((result) => result)
		.catch((err) => err.message);
};

// Update discount to inactive (admin only)
module.exports.deactivateDiscount = (discountId) => {
	return Discount.findByIdAndUpdate(discountId, { isActive: false })
		.then((result) => {
			return { message: "SUCCESS: Discount deactivated" };
		})
		.catch((err) => err.message);
};

// Update discount to active (admin only)
module.exports.activateDiscount = (discountId) => {
	return Discount.findByIdAndUpdate(discountId, { isActive: true })
		.then((result) => {
			return { message: "SUCCESS: Discount activated" };
		})
		.catch((err) => err.message);
};
