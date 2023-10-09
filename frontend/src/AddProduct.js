import React, { useState } from 'react';
import './style.css';

function AddProduct() {
  const [product, setProduct] = useState({ name: '', price: '', description: '', image: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setProduct({ ...product, image: imageFile });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object to send the form data
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('image', product.image); // Include the image

    // Send the form data to the server using fetch
    fetch('http://localhost:5000/api/products', { // Update the URL
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle the response as needed
        // After successfully adding the product, you can redirect to the ProductList page
        if (data.message === 'Product added successfully') {
          window.location.href = '/'; // Redirect to the root route
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddProduct;
