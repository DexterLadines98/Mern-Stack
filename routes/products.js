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

// *EXTRA* Add image for product (admin only)
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

// Update Product information (Admin only)
route.put("/:productId", verify, verifyAdmin, (req, res) => {
	ProductController
		.updateProduct(req.params.productId, req.body)
		.then((updatedProduct) => res.send(updatedProduct))
		.catch((err) => res.send(err.message));
});

//GET ALL ACTIVE PRODUCTS
//route.get("/getActiveProducts", ProductController.getActiveProducts);


//[SECTION] Routes- GET
// Get Single Product
//route.get("/getSingleProduct/:id", ProductController.getSingleProduct);


//[SECTION] Routes- PUT
// Update Product Information - Admin
route.put('/:productId', verify, verifyAdmin, (req, res) => {
ProductController.updateProduct(req.params.productId, req.body).then(result => res.send(result))
})

// Archive Product-Admin
route.put('/:productId/archive', verify, verifyAdmin, (req, res) => {
    ProductController.archiveProduct(req.params.productId).then(result => res.send(result));
})

module.exports = route;