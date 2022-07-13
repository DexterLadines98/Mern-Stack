const express = require("express");
const controller = require("../controllers/categories");
const auth = require("../auth");

const routes = express.Router();

const { verify, verifyAdmin } = auth;

//Create category (admin only)
routes.post("/new", verify, verifyAdmin, (req, res) => {
	controller
		.createCategory(req.body.name)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve active categories
routes.get("/active", (req, res) => {
	controller
		.getActiveCategories()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve all categories (admin only)
routes.get("/all", verify, verifyAdmin, (req, res) => {
	controller
		.getAllCategories()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve active products in specific category
routes.get("/active/:categoryId", (req, res) => {
	controller
		.getActiveCategoryProducts(req.params.categoryId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve all products in specific category (admin only)
routes.get("/all/:categoryId", verify, verifyAdmin, (req, res) => {
	controller
		.getAllCategoryProducts(req.params.categoryId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Edit category name (admin only)
routes.put("/edit/:categoryId", verify, verifyAdmin, (req, res) => {
	controller
		.editCategory(req.params.categoryId, req.body.newName)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Archive a category (admin only)
routes.put("/archive/:categoryId", verify, verifyAdmin, (req, res) => {
	controller
		.archiveCategory(req.params.categoryId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Unarchive a category (admin only)
routes.put("/unarchive/:categoryId", verify, verifyAdmin, (req, res) => {
	controller
		.unarchiveCategory(req.params.categoryId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Delete a category (admin only)
routes.delete("/delete/:categoryId", verify, verifyAdmin, (req, res) => {
	controller
		.deleteCategory(req.params.categoryId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

module.exports = routes;
