const express = require("express");
const controller = require("../controllers/discounts");
const auth = require("../auth");

const routes = express.Router();

const { verify, verifyAdmin } = auth;

// Create discount (admin only)
routes.post("/new", verify, verifyAdmin, (req, res) => {
	controller
		.createDiscount(req.body)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

// Retrieve discounts (admin only)
routes.get("/", verify, verifyAdmin, (req, res) => {
	controller
		.getDiscounts()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

// Retrieve active discounts (admin only)
routes.get("/active", verify, (req, res) => {
	controller
		.getActiveDiscounts()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

// Set discounts to inactive (admin only)
routes.put("/:discountId/deactivate", verify, verifyAdmin, (req, res) => {
	controller
		.deactivateDiscount(req.params.discountId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

// Set discounts to active (admin only)
routes.put("/:discountId/activate", verify, verifyAdmin, (req, res) => {
	controller
		.activateDiscount(req.params.discountId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

module.exports = routes;
