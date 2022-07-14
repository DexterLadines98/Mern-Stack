//[SECTION] Depedencies and Modules
const exp = require('express'); 
const UserController = require('../controllers/users');
const userCtrl = require('../controllers/userCtrl');
const auth = require('../auth');

//[SECTION] Routing Component
const route = exp.Router();
const { verify, verifyAdmin } = auth;

//[SECTION] Routes

//Create New User
route.post('/register', userCtrl.register)

route.post('/activation', userCtrl.activateEmail)

route.post('/login', userCtrl.login)

route.post('/refresh_token', userCtrl.getAccessToken)

// route.post('/register', (req, res) => {
//     let userData = req.body;
//     UserController
//     .register(userData)
//     .then((newUser) => res.send(newUser))
// 	.catch((err) => res.send(err.message));
// });

//Login
// route.post("/login", (req, res) => {
// 	UserController
// 		.userLogin(req.body)
// 		.then((result) => res.send(result))
// 		.catch((err) => res.send(err.message));
// });

// Retrieve authenticated user profile
route.get("/profile", verify, (req, res) => {
	UserController
		.getProfile(req.user.id)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Change password (user only)
route.put("/password", verify, (req, res) => {
	UserController
		.changePassword(req.user.id, req.body)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Add to cart (authed)
route.post("/cart/add/", verify, (req, res) => {
	let productInfo = req.body;
	UserController
		.addToCart(req.user.id, productInfo, req.user.isAdmin)
		.then((result) => res.send(result))
		.catch((err) => res.send(err));
});

//Clear cart
route.delete("/cart/clear", verify, (req, res) => {
	UserController
		.clearCart(req.user.id)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Set user as admin (Admin only)
route.put("/:userId/admin", verify, verifyAdmin, (req, res) => {
	let userId = req.params.userId;
	UserController
		.setAdmin(userId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve user orders
route.get("/orders", verify, (req, res) => {
	let userId = req.user.id;
	UserController
		.getUserOrders(userId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});


// Retrieve all users (admin only)
route.get("/all", verify, verifyAdmin, (req, res) => {
	UserController
		.getAllUsers()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

//Retrieve specific user order
route.get("/order/:orderId", verify, (req, res) => {
	UserController
		.getUserOrder(req.user.id, req.params.orderId)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

// *EXTRA* Increase product quantity
route.put(
	"/cart/increase/quantity/:productId/:uniqueId",
	verify,
	(req, res) => {
		UserController
			.increaseQuantity(req.user.id, req.params.productId, req.params.uniqueId)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);

// *EXTRA* Decrease product quantity
route.put(
	"/cart/decrease/quantity/:productId/:uniqueId",
	verify,
	(req, res) => {
		UserController
			.decreaseQuantity(req.user.id, req.params.productId, req.params.uniqueId)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);

//Delete product from cart
route.delete(
	"/cart/delete/product/:productId/:uniqueId",
	verify,
	(req, res) => {
		UserController
			.deleteProduct(req.user.id, req.params.productId, req.params.uniqueId)
			.then((result) => res.send(result))
			.catch((err) => res.send(err.message));
	}
);
module.exports = route;