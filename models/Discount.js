const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A discount name is required"],
	},
	description: {
		type: String,
		required: [true, "A discount description is required"],
	},
	percentage: {
		type: Number,
		default: 0,
	},
	amount: {
		type: Number,
		default: 0
	},
	isActive: {
		type: Boolean,
		default: true
	}
});

module.exports = new mongoose.model("Discount", discountSchema);