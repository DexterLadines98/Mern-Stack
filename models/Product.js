const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product name is required"],
	},
	description: {
		type: String,
		required: [true, "Product description is required"],
	},
	price: {
		type: Number,
		required: [true, "Product price is required"],
	},
	stocks: {
		type: Number,
		default: 1,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	createdOn: {
		type: Date,
		default: new Date(),
	},
	image: [
		{
			imageId: {
				type: String,
				required: [true, "Product image ID is required"],
			},
			filename: {
				type: String,
				required: [true, "Product image name is required"],
			},
		},
	],
	categories: [
		{
			categoryId: {
				type: String,
				required: [true, "Category ID is required"],
			},
		},
	],
	options: [
		{
			label: {
				type: String,
				required: [true, "Label is required"],
			},
			value: {
				type: String,
				required: [true, "Value is required"],
			},
		},
	],
});

module.exports = mongoose.model("Product", productSchema);
