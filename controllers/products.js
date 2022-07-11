const Product = require("../models/Product");
//const Category = require("../models/Category");
//const { options } = require("../routes/products");

// Create Product (Admin only)
module.exports.createProduct = async (productInfo) => {
	let { name } = productInfo;

	let productFound = await Product.findOne({ name })
		.then((product) => product)
		.catch((err) => err.message);

	if (productFound) {
		return new Promise((resolve, reject) => {
			return resolve({
				message: "ERROR: a product with same name exists",
			});
		});
	} else {
		let newProduct = new Product(productInfo);

		return newProduct
			.save()
			.then((result) => {
				return { message: "success", id: result._id };
			})
			.catch((err) => err.message);
	}
};

//Add image for product (Admin only)
module.exports.uploadImage = (productId, image) => {
	return Product.findById(productId)
		.then((product) => {
			let newImage = {
				imageId: image.id,
				filename: image.filename,
			};
			product.image.push(newImage);
			return product
				.save()
				.then((result) => {
					return { message: "Image updated" };
				})
				.catch((err) => err.message);
		})
		.catch((err) => err.message);
};

// *EXTRA* Add custom order option (Admin only)
module.exports.addOption = (productId, optionInfo) => {
	return Product.findById(productId)
		.then((product) => {
			const optionExists = product.options.find(
				(option) =>
					option.label === optionInfo.label && option.value === optionInfo.value
			);

			if (optionExists)
				throw { message: "error: duplicate value in the same option label" };
			else {
				let newOption = {
					label: optionInfo.label,
					value: optionInfo.value,
				};
				product.options.push(newOption);
				return product
					.save()
					.then(() => {
						return { message: "success" };
					})
					.catch((err) => err.message);
			}
		})
		.catch((err) => err.message);
};

// *EXTRA* Add category (admin only)
module.exports.addCategory = async (productId, categoryId) => {
	return await Product.findById(productId).then(async (product) => {
		const category = await Category.findById(categoryId);
		if (category.isActive) {
			product.categories.push({ categoryId });
			const productUpdated = await product
				.save()
				.then()
				.catch((err) => err.message);

			if (productUpdated) {
				return await Category.findById(categoryId)
					.then((category) => {
						category.products.push({ productId });
						return category
							.save()
							.then(() => {
								return { message: "Category added to product" };
							})
							.catch((err) => err.message);
					})
					.catch((err) => err.message);
			} else {
				return { message: "Error with product" };
			}
		} else {
			return { message: "Category is inactive" };
		}
	});
};

// Retrieve all active products
module.exports.getActiveProducts = () => {
	return Product.find({ isActive: true })
		.then((products) => {
			return products;
		})
		.catch((err) => err.message);
};

// Retrieve single product
module.exports.getProduct = (productId) => {
	return Product.findById(productId)
		.then((product) => {
			if (product.isActive) {
				return product;
			} else {
				return { message: "Product is not active" };
			}
		})
		.catch((err) => err.message);
};

// *EXTRA* Retrieve any single product (admin only)
module.exports.getAnyProduct = (productId) => {
	return Product.findById(productId)
		.then((product) => product)
		.catch((err) => err.message);
};

// *EXTRA* Retrieve all products (admin only)
module.exports.getAllProducts = () => {
	return Product.find({})
		.then((result) => result)
		.catch((err) => err.message);
};

// Update Product information (Admin only)
module.exports.updateProduct = (productId, newData) => {
	return Product.findByIdAndUpdate(productId, newData)
		.then(() => {
			return { message: "Update success" };
		})
		.catch((err) => err.message);
};

// Archive Product (Admin only)
module.exports.archiveProduct = (productId) => {
	return Product.findByIdAndUpdate(productId, { isActive: false })
		.then(() => {
			return { message: "Product archived" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Unarchive Product (Admin only)
module.exports.unarchiveProduct = (productId) => {
	return Product.findByIdAndUpdate(productId, { isActive: true })
		.then(() => {
			return { message: "Product unarchived" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Delete an option (admin only)
module.exports.deleteOption = (productId, optionInfo) => {
	return Product.findById(productId)
		.then((product) => {
			const optionFound = product.options.find(
				(option) =>
					option.label === optionInfo.label && option.value === optionInfo.value
			);

			if (optionFound) {
				const optionsArr = product.options;
				optionsArr.splice(optionsArr.indexOf(optionFound), 1);
				return product.save().then(() => {
					return { message: "success" };
				});
			} else {
				throw { message: "error: no option value exists in option label" };
			}
		})
		.catch((err) => err.message);
};

// *EXTRA* Delete a category (admin only)
module.exports.deleteCategory = async (productId, categoryId) => {
	return await Product.findByIdAndUpdate(productId, {
		$pull: {
			categories: {
				categoryId,
			},
		},
	})
		.then(async () => {
			return await Category.findByIdAndUpdate(categoryId, {
				$pull: {
					products: {
						productId,
					},
				},
			})
				.then(() => {
					return { message: "Category deleted successfully" };
				})
				.catch((err) => err.message);
		})
		.catch((err) => err.message);
};
