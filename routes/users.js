//[SECTION] Depedencies and Modules
const exp = require('express'); 
const UserController = require('../controllers/users');
const auth = require('../auth')

//[SECTION] Routing Component
const route = exp.Router();
const { verify, verifyAdmin } = auth;

//[SECTION] Routes

//Create New User
route.post('/register', (req, res) => {
    let userData = req.body;
    UserController
    .register(userData)
    .then((newUser) => res.send(newUser))
	.catch((err) => res.send(err.message));
});

//Login
route.post("/login", (req, res) => {
	UserController
		.userLogin(req.body)
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

// GET the user's details
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

//Add to Cart
route.post("/addToCart", verify, (req, res) => {
    let productInfo = req.body;
    UserController.addToCart(req.user.id, productInfo).then((result) => res.send(result))
        .catch((err) => res.send(err));
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
route.get("/getUserOrders", verify, (req, res) => {
    let userId = req.user.id;
    UserController.getUserOrders(userId).then((result) => res.send(result))
        .catch((err) => res.send(err.message));
});

// Retrieve all users (admin only)
route.get("/all", verify, verifyAdmin, (req, res) => {
	UserController
		.getAllUsers()
		.then((result) => res.send(result))
		.catch((err) => res.send(err.message));
});

module.exports = route;