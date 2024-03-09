import React, { useEffect, useState } from 'react';
import QueryComponent from './QueryWindow';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null)
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = (option, queryValue) => {
    // Perform search based on selected option and query value
    // Update search result state
    setSearchResult([...searchResult, { option, queryValue }]); // Example: Just adding the search to a list
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:5000/product')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json().then(data => {
            // console.log('Data received:', data);
            setProducts(data);
            setError(null); // Clear any previous errors
          });
        } else {
          throw new Error('Response is not in JSON format');
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError(error.message); // Set error message for display
      });
  }, []);

  return (
    <div>
      <h2>Product List</h2>  
      <ul>
        {products.map(product => (
          <li key={product.productID} >
            <h3>{product.productName}</h3>
            <p>Supplier ID: {product.supplierID}</p>
            <p>Category ID: {product.categoryID}</p>
            <p>Unit: {product.unit}</p>
            <p>Price: {product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
