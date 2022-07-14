//[SECTION] Depedencies and Modules
const express = require('express');
const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
const dotenv = require('dotenv');
const cors = require('cors');
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");
const userRoutes = require('./routes/users'); 
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require("./routes/categories");
const discountRoutes = require("./routes/discounts");
const courierRoutes = require("./routes/couriers");

const auth = require("./auth");
const { response } = require('express');
const { verify, verifyAdmin } = auth;
const Product = require("./models/Product");
//[SECTION] Environment Setup
dotenv.config(); 
let account = process.env.CREDENTIALS;
const port = process.env.PORT;

// for image handling
let gfs, gridfsBucket;

//[SECTION] Server Setup
const app = express();
app.use(express.json()); 
app.use(cors());


//[SECTION] Database Connection
mongoose.connect(account);
const connectStatus = mongoose.connection;
connectStatus.once('open', async () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(connectStatus.db, {
		bucketName: "productPhotos",
	}); 

    gfs = Grid(connectStatus.db, mongoose.mongo);
	gfs.collection("productPhotos");
	console.log(`Connected to Database`);
});



//[SECTION] Backend Routes
app.use('/users', userRoutes);  
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/discounts", discountRoutes);
app.use("/couriers", courierRoutes);

//[SECTION] Server Gateway Response
app.get('/', (req, res) => {
    res.send('Welcome to our API')
});
app.post('/pay', (req, res) => {
	
});
app.get('/search/:key', async (req, res) => {
	let data = await Product.find(
		{
			"$or": [
				{name:{$regex:req.params.key}},
				{description:{$regex:req.params.key}}
			]
		}
	)
	res.send(data);
})
app.listen(port, () => {
    console.log(`API is Hosted port ${port}`);
});


// *EXTRA* Retrieve product image
app.get("/products/image/:productId", async (req, res) => {
	try {
		const filename = await Product.findById(req.params.productId)
			.then((product) => {
				return product.image[0].filename;
			})
			.catch((err) => res.send(err.message));
		const file = await gfs.files.findOne({ filename });
		const readStream = gridfsBucket.openDownloadStream(file._id);
		readStream.pipe(res);
	} catch (error) {
		res.send("not found");
	}
});

// *EXTRA* Delete product image (admin only)
app.delete(
	"/products/image/:productId",
	verify,
	verifyAdmin,
	async (req, res) => {
		try {
			const image = await Product.findById(req.params.productId)
				.then(async (product) => {
					await Product.findByIdAndUpdate(req.params.productId, {
						$pull: {
							image: {
								imageId: product.image[0].imageId,
							},
						},
					})
						.then()
						.catch((err) => res.send(err.message));
					return product.image[0];
				})
				.catch((err) => res.send(err.message));

			await gfs.files.deleteOne({ filename: image.filename });

			return res.send("success");
		} catch (error) {
			return res.send("An error occured.");
		}
	}
);