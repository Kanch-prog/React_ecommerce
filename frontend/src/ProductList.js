import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './style.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    // Fetch products from the API
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, []);

  const handleCheckboxChange = (e, productId) => {
    const isChecked = e.target.checked;
    setSelectedProducts((prevSelected) => {
      if (isChecked) {
        return { ...prevSelected, [productId]: true };
      } else {
        const updatedSelected = { ...prevSelected };
        delete updatedSelected[productId];
        return updatedSelected;
      }
    });
  };
  

  const handleDelete = () => {
    const productIdsToDelete = Object.keys(selectedProducts);
  
    // Send a DELETE request to the server with the product IDs to be deleted
    fetch('http://localhost:5000/api/products/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productsToDelete: productIdsToDelete }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response or update the product list as needed
        console.log(data);
        if (data.message === 'Products deleted successfully') {
          // Update the local products state by filtering out the deleted products
          setProducts((prevProducts) =>
            prevProducts.filter((product) => !selectedProducts[product.id])
          );
  
          // Clear the selectedProducts state
          setSelectedProducts({});
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <Link to="/add-product"> {/* Link to the Add Product page */}
        <button className="add-product-button">Add Product</button>
      </Link>
      <button onClick={handleDelete}>Delete Selected</button> {/* Moved here */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <input
              type="checkbox"
              value={product.id}
              checked={!!selectedProducts[product.id]}
              onChange={(e) => handleCheckboxChange(e, product.id)}
            />
            <img
              src={`http://localhost:5000/images/${product.image_url}`}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
