// App.js
import React, { useState } from 'react';
import QueryComponent from './components/QueryWindow';
import AddProduct from './components/AddProduct';

function App() {
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (result) => {
    setSearchResult(result);
  };

  return (
    <div>
      <h1>Data Search</h1>
      <QueryComponent onSearch={handleSearch} />
      <hr />
      {/* <h2>Search Results</h2>
      {searchResult && (
        <ul>
          {searchResult.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )} */}

      <div>
        <AddProduct />
      </div>
    </div>

    
  );
}

export default App;
