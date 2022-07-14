const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
require("dotenv").config();

const auth = require("../auth");

const salt = +process.env.SALT;

// User registration


//Clear cart
module.exports.clearCart = (userId) => {
	return User.findByIdAndUpdate(userId, { cart: [] })
		.then((result) => {
			return { message: "cart cleared" };
		})
		.catch((err) => err.message);
};
//Retrieve authenticated user profile
module.exports.getProfile = (userId) => {
	return User.findById(userId)
		.then((user) => {
			user.password = "";
			return user;
		})
		.catch((err) => err.message);
};

// Retrieve authenticated user’s orders
module.exports.getUserOrders = (userId) => {
	return Order.find({ userId })
		.then((result) => result)
		.catch((err) => err.message);
};

// *EXTRA* Retrieve all users (admin only)
module.exports.getAllUsers = () => {
	return User.find({})
		.then((userList) => userList)
		.catch((err) => err.message);
};

// *EXTRA* Retrieve specific order of user
module.exports.getUserOrder = (userId, orderId) => {
	return Order.findOne({ _id: orderId, userId })
		.then((result) => {
			let orderFound = result.status;
			if (orderFound) {
				return result;
			}
		})
		.catch((err) => err.message);
};

// *STRETCH* Set user as admin (Admin only)
module.exports.setAdmin = (userId) => {
	return User.findByIdAndUpdate(userId, { isAdmin: true })
		.then(() => {
			return { message: "SUCCESS: User updated to admin" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Increase product quantity
module.exports.increaseQuantity = (userId, productId, uniqueId) => {
	if (userId) {
		return User.findById(userId).then((user) => {
			const newUserCart = user.cart.map((product) => {
				if (
					product.productId === productId &&
					product._id.toString() === uniqueId
				) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});

			user.cart = newUserCart;
			return user
				.save()
				.then(() => {
					return { message: "quantity increased" };
				})
				.catch((err) => err.message);
		});
	} else {
		return { message: "user not found" };
	}
};

//*EXTRA* Decrease product quantity
module.exports.decreaseQuantity = (userId, productId, uniqueId) => {
	if (userId) {
		return User.findById(userId).then((user) => {
			const productFound = user.cart.find(
				(product) =>
					product.productId === productId && product._id.toString() === uniqueId
			);

			if (productFound) {
				const newUserCart = user.cart.map((product) => {
					if (
						product.productId === productId &&
						product._id.toString() === uniqueId
					) {
						product.quantity = product.quantity - 1;
						if (product.quantity === 0) {
							return null;
						} else {
							return product;
						}
					} else {
						return product;
					}
				});

				if (newUserCart.includes(null))
					newUserCart.splice(newUserCart.indexOf(null), 1);

				user.cart = newUserCart;
				return user
					.save()
					.then(() => {
						return { message: "quantity decreased" };
					})
					.catch((err) => err.message);
			} else {
				return { message: "product not found" };
			}
		});
	} else {
		return { message: "user not found" };
	}
};

//*EXTRA* Change pasword
module.exports.changePassword = (userId, userInfo) => {
	let currentPassword = userInfo.currentPassword;
	let newPassword = userInfo.newPassword;

	return User.findById(userId)
		.then((user) => {
			const pwValid = bcrypt.compareSync(currentPassword, user.password);
			if (pwValid) {
				user.password = bcrypt.hashSync(newPassword, salt);
				return user
					.save()
					.then(() => {
						return { message: "Password updated" };
					})
					.catch((err) => err.message);
			} else {
				return { message: "Update failed, current password is wrong" };
			}
		})
		.catch((err) => err.message);
};

//*EXTRA* Delete product from cart
module.exports.deleteProduct = (userId, productId, uniqueId) => {
	if (userId) {
		return User.findById(userId).then((user) => {
			const productFound = user.cart.find(
				(product) =>
					product.productId === productId && product._id.toString() === uniqueId
			);

			if (productFound) {
				const newUserCart = user.cart.map((product) => {
					if (
						product.productId === productId &&
						product._id.toString() === uniqueId
					) {
						return null;
					} else {
						return product;
					}
				});

				newUserCart.splice(newUserCart.indexOf(null), 1);

				user.cart = newUserCart;
				return user
					.save()
					.then(() => {
						return { message: "product removed" };
					})
					.catch((err) => err.message);
			} else {
				return { message: "product not found" };
			}
		});
	} else {
		return { message: "user not found" };
	}
};
