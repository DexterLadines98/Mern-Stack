//[SECTION] Depedencies and Modules
const express = require("express");
const ProductController = require("../controllers/products");
const upload = require("../middleware/upload");

//[SECTION] Routing Component
const route = express.Router();
const auth = require('../auth');

const { verify, verifyAdmin } = auth;


// Create Product (Admin only)
route.post("/new", verify, verifyAdmin, (req, res) => {
	let productInfo = req.body;
	ProductController
		.createProduct(productInfo)
		.then((product) => res.send(product))
		.catch((err) => res.send(err.message));
});

//Add image for product (admin only)
route.post(
	"/image/:productId",
	verify,
	verifyAdmin,
	upload.single("file"),
	async (req, res) => {
		if (req.file === undefined) return res.send("you must select a file.");
		return ProductController
			.uploadImage(req.params.productId, req.file)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);

// *EXTRA* Add a category (admin only)
route.post(
	"/:productId/category/:categoryId/add",
	verify,
	verifyAdmin,
	(req, res) => {
		let productId = req.params.productId;
		let categoryId = req.params.categoryId;
		ProductController
			.addCategory(productId, categoryId)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);

// Retrieve all active products
route.get("/active", (req, res) => {
	ProductController
		.getActiveProducts()
		.then((products) => res.send(products))
		.catch((err) => res.send(err.message));
});

// Retrieve single product
route.get("/:productId/", (req, res) => {
	ProductController
		.getProduct(req.params.productId)
		.then((product) => res.send(product))
		.catch((err) => res.send(err.message));
});

//Retrieve any single product (admin only)
route.get("/admin/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.getAnyProduct(req.params.productId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve all products (admin only)
route.get("/", verify, verifyAdmin, (req, res) => {
	ProductController
		.getAllProducts()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Add custom order option (admin only)
route.post("/option/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.addOption(req.params.productId, req.body)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Add a category (admin only)
route.post(
	"/:productId/category/:categoryId/add",
	verify,
	verifyAdmin,
	(req, res) => {
		let productId = req.params.productId;
		let categoryId = req.params.categoryId;
		ProductController
			.addCategory(productId, categoryId)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);

// Update Product information (Admin only)
route.put("/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.updateProduct(req.params.productId, req.body)
		.then((updatedProduct) => res.send(updatedProduct))
		.catch((err) => res.send(err.message));
});

// Archive Product (Admin only)
route.put("/archive/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.archiveProduct(req.params.productId)
		.then((updatedProduct) => res.send(updatedProduct))
		.catch((err) => res.send(err.message));
});

//Unarchive Product (Admin only)
route.put("/unarchive/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.unarchiveProduct(req.params.productId)
		.then((updatedProduct) => res.send(updatedProduct))
		.catch((err) => res.send(err.message));
});


// Delete an option (admin only)
route.delete("/option/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.deleteOption(req.params.productId, req.body)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Delete a category (admin only)
route.delete(
	"/:productId/category/:categoryId/delete",
	verify,
	verifyAdmin,
	(req, res) => {
		ProductController
			.deleteCategory(req.params.productId, req.params.categoryId)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);
module.exports = route;