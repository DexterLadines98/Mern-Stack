const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "User ID is required"],
	},
	totalAmount: {
		type: Number,
		default: 0,
	},
	purchasedOn: {
		type: Date,
		default: new Date(),
	},
	comments: {
		type: String,
		default: "",
	},
	shippingInfo: {
		type: String,
		required: [true, "Shipping information is needed"],
	},
	paymentMethod: {
		type: String,
		required: [true, "A payment method is required"],
	},
	status: {
		type: String,
		default: "pending",
	},
	courier: [
		{
			courierId: {
				type: String,
				required: [true, "A courier is required"],
			},
		},
	],
	discount: [
		{
			discountId: {
				type: String,
				required: [true, "Discount id is required"],
			},
			percentage: {
				type: Number,
				default: 0,
			},
			amount: {
				type: Number,
				required: [true, "Discount amount is required"],
			},
		},
	],
	products: [
		{
			productId: {
				type: String,
				required: [true, "Product ID is required"],
			},
			options: {
				type: String,
				default: "",
			},
			quantity: {
				type: Number,
				required: [true, "Product quantity is required"],
			},
		},
	],
});

module.exports = new mongoose.model("Order", orderSchema);
