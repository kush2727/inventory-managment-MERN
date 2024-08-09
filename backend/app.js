const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createConnection } = require('typeorm');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use('/uploads',express.static('/uploads'))



// Connect to the database
createConnection().then(() => {
  console.log('Database connected!');
}).catch(error => console.log('Error connecting to the database:', error));

// Import and use routes
const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer');
const saleRoutes = require('./routes/sale');

app.use('/products', productRoutes);

app.use('/customers', customerRoutes);
app.use('/sales', saleRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
