const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
	},
	password: {
		type: String,
		require: [true, "Password is required"],
	},
	firstName: {
		type: String,
		default: "",
	},
	lastName: {
		type: String,
		default: "",
	},
	address: {
		type: String,
		default: "",
	},
	mobileNum: {
		type: String,
		default: "",
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	registeredOn: {
		type: Date,
		default: new Date(),
	},
	cart: [
		{
			productId: {
				type: String,
				required: [true, "Product must have an ID"],
			},
			quantity: {
				type: Number,
				default: 1,
			},
			options: {
				type: String,
				default: "",
			},
			dateAdded: {
				type: Date,
				default: new Date(),
			},
		},
	],
});

module.exports = mongoose.model("User", userSchema);
