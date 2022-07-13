const Category = require("../models/Category");
const Product = require("../models/Product");

// *EXTRA* Create a category (admin only)
module.exports.createCategory = async (categoryName) => {
	const categoryExists = await Category.findOne({ name: categoryName }).then(
		(result) => {
			if (result) return true;
			return false;
		}
	);

	if (categoryExists)
		return Promise.reject({ message: "error: product exists" });

	let newCategoryDetails = {
		name: categoryName,
	};

	let newCategory = new Category(newCategoryDetails);
	return newCategory
		.save()
		.then(() => {
			return { message: "success" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Retrieve active categories
module.exports.getActiveCategories = () => {
	return Category.find({ isActive: true })
		.then((result) => result)
		.catch((err) => err.message);
};

// *EXTRA* Retrieve all categories (admin only)
module.exports.getAllCategories = () => {
	return Category.find()
		.then((result) => result)
		.catch((err) => err.message);
};

// *EXTRA* Retrieve active products in specific category
module.exports.getActiveCategoryProducts = (categoryId) => {
	return Category.findById(categoryId)
		.then(() => {
			return Product.find({
				isActive: true,
				"categories.categoryId": categoryId,
			})
				.then((result) => result)
				.catch((err) => err.message);
		})
		.catch((err) => err.message);
};

// *EXTRA* Retrieve all products in specific category (admin only)
module.exports.getAllCategoryProducts = (categoryId) => {
	return Category.findById(categoryId)
		.then(() => {
			return Product.find({
				"categories.categoryId": categoryId,
			})
				.then((result) => result)
				.catch((err) => err.message);
		})
		.catch((err) => err.message);
};

// *EXTRA* Edit category name (admin only)
module.exports.editCategory = async (categoryId, newName) => {
	const categoryFound = await Category.findOne({ name: newName })
		.then((categoryExists) => {
			if (categoryExists) return true;
			return false;
		})
		.catch((err) => {
			throw err;
		});

	if (categoryFound) return Promise.reject({ message: "Category exists" });

	return Category.findByIdAndUpdate(categoryId, { name: newName })
		.then(() => {
			return { message: "Category name updated" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Archive a category (admin only)
module.exports.archiveCategory = (categoryId) => {
	return Category.findByIdAndUpdate(categoryId, { isActive: false })
		.then(() => {
			return { message: "Category archived" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Unarchive a category (admin only)
module.exports.unarchiveCategory = (categoryId) => {
	return Category.findByIdAndUpdate(categoryId, { isActive: true })
		.then(() => {
			return { message: "Category unarchived" };
		})
		.catch((err) => err.message);
};

// *EXTRA* Delete a category (admin only)
module.exports.deleteCategory = async (categoryId) => {
	let productExists = await Category.findById(categoryId)
		.then((category) => {
			if (category.products.length) {
				return true;
			} else {
				return false;
			}
		})
		.catch((err) => err.message);
	if (productExists) {
		return { message: "Can't delete category linked to products" };
	} else {
		return Category.findByIdAndRemove(categoryId)
			.then(() => {
				return { message: "Category removed" };
			})
			.catch((err) => err.message);
	}
};
