import React, { useState } from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Add Product
      </Typography>
      {successMessage && <Typography variant="body1" color="success">{successMessage}</Typography>}
      {addedProduct && (
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6">Added Product</Typography>
          <Typography variant="body1">Product ID: {addedProduct.productID}</Typography>
          <Typography variant="body1">Product Name: {addedProduct.productName}</Typography>
          <Typography variant="body1">Supplier ID: {addedProduct.supplierID}</Typography>
          <Typography variant="body1">Category ID: {addedProduct.categoryID}</Typography>
          <Typography variant="body1">Unit: {addedProduct.unit}</Typography>
          <Typography variant="body1">Price: {addedProduct.price}</Typography>
        </Paper>
      )}
      {showForm && <ProductForm onSubmit={handleSubmit} />}
      {addedProduct && (
        <Button variant="contained" color="primary" onClick={handleResetForm} style={{ marginTop: '20px' }}>
          Add Another Product
        </Button>
      )}
    </Box>
  );
};

export default AddProduct;
