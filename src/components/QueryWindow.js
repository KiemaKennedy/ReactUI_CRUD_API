import React, { useState, useEffect } from 'react';

function QueryComponent({ onSearch }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [searchFields, setSearchFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [queryValue, setQueryValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Fetch fields for the selected dataset when selectedOption changes
    if (selectedOption) {
      fetchFields(selectedOption);
    }
  }, [selectedOption]);

  const fetchFields = async (option) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/${option}/fields`);
      if (!response.ok) {
        throw new Error('Failed to fetch fields');
      }
      const data = await response.json();
      // Set the search fields based on the fetched data
      setSearchFields(data.fields || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setSearchFields([]);
    setSelectedField('');
    setQueryValue('');
  };

  const handleFieldChange = (field) => {
    setSelectedField(field);
  };

  const handleQueryValueChange = (value) => {
    setQueryValue(value);
  };

  const handleSearch = async () => {
    const endpoint = `http://localhost:5000/${selectedOption}/search?field=${selectedField}&value=${queryValue}`;
    try {
      // Perform API request using the provided endpoint
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      // Parse the response JSON
      const data = await response.json();
      // Update the search result state with the retrieved object
      setSearchResult(data);
      onSearch(data); // Notify parent component about the search result
    } catch (error) {
      console.error('Error fetching search results:', error);
      onSearch(null);
    }
  };

  const renderSearchResult = () => {
    if (!searchResult || searchResult.length === 0) return null;
    
    return (
      <div>
        <h2>Search Results</h2>
        <table>
          <thead>
            <tr>
              {Object.keys(searchResult[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searchResult.map((record, index) => (
              <tr key={index}>
                {Object.values(record).map((value, index) => (
                  <td key={index}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  return (
    <div>
      <select value={selectedOption} onChange={(e) => handleOptionChange(e.target.value)}>
        <option value="">Select Option</option>
        <option value="product">Products</option>
        <option value="supplier">Supplier</option>
        <option value="category">Categories</option>
        {/* Add more options for other datasets */}
      </select>
      {loading && <p>Loading...</p>}
      {selectedOption && !loading && searchFields.length > 0 && (
        <div>
          <select value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
            <option value="">Select Field</option>
            {searchFields.map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
          <input
            type="text"
            value={queryValue}
            onChange={(e) => handleQueryValueChange(e.target.value)}
            placeholder="Enter search value"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}
      {renderSearchResult()}
    </div>
  );
}

export default QueryComponent;
