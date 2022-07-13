const mongoose = require("mongoose");

const courierSchema = new mongoose.Schema({
	courierName: {
		type: String,
		required: [true, "Courier name is required"],
	},
	price: {
		type: Number,
		required: [true, "Shipping price is required"],
	},
	eta: {
		type: String,
		required: [true, "Shipping ETA is required"],
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	createdOn: {
		type: Date,
		default: new Date(),
	},
});

module.exports = new mongoose.model("Courier", courierSchema);
