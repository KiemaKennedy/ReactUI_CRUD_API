import React, { useState } from 'react';
import ProductForm from './ProductForm';

const AddProduct = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [addedProduct, setAddedProduct] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      // Handle success response
      const data = await response.json();
      setAddedProduct(data); // Set the added product data
      setSuccessMessage('Product added successfully');
      setShowForm(false); // Hide the form after product is added
    } catch (error) {
      console.error('Error adding product:', error);
      setSuccessMessage('Failed to add product');
      setAddedProduct(null);
    }
  };

  const handleResetForm = () => {
    setShowForm(true); // Show the form again
    setSuccessMessage('');
    setAddedProduct(null);
  };

  return (
    <div>
      <h2>Add Product</h2>
      {successMessage && <p>{successMessage}</p>}
      {addedProduct && (
        <div>
          <h3>Added Product</h3>
          <p>Product ID: {addedProduct.productID}</p>
          <p>Product Name: {addedProduct.productName}</p>
          <p>Supplier ID: {addedProduct.supplierID}</p>
          <p>Category ID: {addedProduct.categoryID}</p>
          <p>Unit: {addedProduct.unit}</p>
          <p>Price: {addedProduct.price}</p>
        </div>
      )}
      {showForm && <ProductForm onSubmit={handleSubmit} />}
      {addedProduct && (
        <button onClick={handleResetForm}>Add Another Product</button>
      )}
    </div>
  );
};

export default AddProduct;