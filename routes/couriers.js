const express = require("express");
const controller = require("../controllers/couriers");

const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const routes = express.Router();

//Add courier (admin only)
routes.post("/", verify, verifyAdmin, (req, res) => {
	controller
		.addCourier(req.body)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Get couriers (admin only)
routes.get("/", verify, verifyAdmin, (req, res) => {
	controller
		.getCouriers()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Get couriers
routes.get("/active", (req, res) => {
	controller
		.getActiveCouriers()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Deactivate courier (admin only)
routes.put("/deactivate/:courierId", verify, verifyAdmin, (req, res) => {
	controller
		.deactivateCourier(req.params.courierId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Activate courier (admin only)
routes.put("/activate/:courierId", verify, verifyAdmin, (req, res) => {
	controller
		.activateCourier(req.params.courierId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

module.exports = routes;
