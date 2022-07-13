//[SECTION] Dependencies and Modules
const exp = require('express');
const OrderController = require('../controllers/orders');


//[SECTION] Routing Component

const route = exp.Router();
const auth = require("../auth");
const {verify, verifyAdmin} = auth;


// Non-admin user checkout
route.post("/new/", verify, OrderController.checkout);


// Retrieve all orders (Admin only)
route.get("/all", verify, verifyAdmin, OrderController.getAllOrders);

// Update order status (admin only)
route.put("/status/:orderId", verify, verifyAdmin, OrderController.updateStatus);

module.exports = route;