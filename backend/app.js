const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Import multer
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data from the request body
app.use('/images', express.static('images'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage }); // Configure multer with the storage options

app.get('/', (req, res) => {
  res.send('Hello, this is your e-commerce app!');
});

app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products from the database: ', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Route to insert product data from the AddProduct form
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const imageUrl = `${req.file.originalname}`;

  // Insert product data into the database along with the image URL
  const insertQuery = 'INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)';

  db.query(insertQuery, [name, price, description, imageUrl], (dbErr, results) => {
    if (dbErr) {
      console.error('Error inserting product into the database: ', dbErr);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Product added successfully to the database');
      res.status(201).json({ message: 'Product added successfully' }); // JSON response
    }
  });
});

// Perform the delete operation
app.delete('/api/products/delete', (req, res) => {
  const { productsToDelete } = req.body;

  // Ensure that productsToDelete is an array of product IDs
  if (!Array.isArray(productsToDelete) || productsToDelete.length === 0) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  // Perform the delete operation in your database
  const deleteQuery = 'DELETE FROM products WHERE id IN (?)';
  db.query(deleteQuery, [productsToDelete], (dbErr, results) => {
    if (dbErr) {
      console.error('Error deleting products: ', dbErr);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Products deleted successfully');
      res.status(200).json({ message: 'Products deleted successfully' });
    }
  });
});


// Define other routes as needed

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
