const Courier = require("../models/Courier");

// *EXTRA* Add courier (admin only)
module.exports.addCourier = (input) => {
	let { courierName, price, eta } = input;
	let newCourier = new Courier({ courierName, price, eta });

	return newCourier
		.save()
		.then(() => {
			return { message: "Courier added" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Get couriers (admin only)
module.exports.getCouriers = () => {
	return Courier.find({})
		.then((couriers) => couriers)
		.catch((err) => err.message);
};

// *EXTRA* Get couriers
module.exports.getActiveCouriers = () => {
	return Courier.find({ isActive: true })
		.then((couriers) => couriers)
		.catch((err) => err.message);
};

// *EXTRA* Deactivate courier (admin only)
module.exports.deactivateCourier = (courierId) => {
	return Courier.findByIdAndUpdate(courierId, { isActive: false })
		.then(() => {
			return { message: "Courier deactivated" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Active courier (admin only)
module.exports.activateCourier = (courierId) => {
	return Courier.findByIdAndUpdate(courierId, { isActive: true })
		.then(() => {
			return { message: "Courier activated" };
		})
		.catch((err) => err.message);
};
