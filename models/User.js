const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
        type: String,
        required: [true, "Please Enter your Name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password!"]
    },
	isAdmin: {
		type: Boolean,
		default: false,
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
			dateAdded: {
				type: Date,
				default: new Date(),
			},
		},
	],
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
