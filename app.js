//[SECTION] Depedencies and Modules
const express = require('express');
const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users'); 
const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');

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
// app.use('/orders', orderRoutes);

//[SECTION] Server Gateway Response
app.get('/', (req, res) => {
    res.send('Welcome to our API')
});
app.listen(port, () => {
    console.log(`API is Hosted port ${port}`);
});
