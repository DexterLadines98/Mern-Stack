const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Category name is required"],
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	products: [
		{
			productId: {
				type: String,
				required: [true, "Product ID is required for category"],
			},
		},
	],
});

module.exports = new mongoose.model("Category", categorySchema);
