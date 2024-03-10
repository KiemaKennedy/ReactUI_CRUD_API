import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Input,
  Button,
  CircularProgress,
} from '@mui/material';

function QueryComponent({ onSearch }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [searchFields, setSearchFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [queryValue, setQueryValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');

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

  // Inside your QueryComponent function
const handleDelete = async (record) => {
  try {
    const { [`${selectedOption}ID`]: id } = record;
    const response = await fetch(`http://localhost:5000/${selectedOption}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete record');
    }
    // Filter out the deleted record from the search result
    setSearchResult((prevSearchResult) =>
      prevSearchResult.filter((rec) => rec[`${selectedOption}ID`] !== id)
    );
     // Set delete success message
    setDeleteSuccessMessage(`${selectedOption} deleted successfully`);
  } catch (error) {
    console.error('Error deleting record:', error);
  }
};



  const handleUpdate = (record) => {
    setEditingRecordId(record[`${selectedOption}ID`]);
    setFormData(record);
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/${selectedOption}/${editingRecordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update record');
      }
      // Handle success response
      const updatedData = await response.json();
      setSearchResult((prevSearchResult) =>
        prevSearchResult.map((record) =>
          record[`${selectedOption}ID`] === updatedData[`${selectedOption}ID`] ? updatedData : record
        )
      );
      setEditingRecordId(null); // Reset editing state
      setFormData({}); // Reset form data
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const renderSearchResult = () => {
    if (!searchResult || searchResult.length === 0) return null;

    return (
      <div>
        <h2>Search Results</h2>
        {deleteSuccessMessage && <p>{deleteSuccessMessage}</p>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(searchResult[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResult.map((record, index) => (
                <TableRow key={index}>
                  {Object.entries(record).map(([field, value]) => (
                    <TableCell key={field}>
                      {editingRecordId === record[`${selectedOption}ID`] ? (
                        <Input
                          value={formData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                        />
                      ) : (
                        typeof value === 'object' ? JSON.stringify(value) : value
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editingRecordId === record[`${selectedOption}ID`] ? (
                      <Button onClick={handleSubmit}>Submit</Button>
                    ) : (
                      <><Button onClick={() => handleUpdate(record)}>Edit</Button>
                      <Button onClick={() => handleDelete(record)}>Delete</Button></>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div>
      <Select value={selectedOption} onChange={(e) => handleOptionChange(e.target.value)}>
        <MenuItem value="">Select Option</MenuItem>
        <MenuItem value="product">Products</MenuItem>
        <MenuItem value="supplier">Supplier</MenuItem>
        <MenuItem value="category">Categories</MenuItem>
        {/* Add more options for other datasets */}
      </Select>
      {loading && <CircularProgress />}
      {selectedOption && !loading && searchFields.length > 0 && (
        <div>
          <Select value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
            <MenuItem value="">Select Field</MenuItem>
            {searchFields.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
          <Input
            type="text"
            value={queryValue}
            onChange={(e) => handleQueryValueChange(e.target.value)}
            placeholder="Enter search value"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      )}
      {renderSearchResult()}
    </div>
  );
}

export default QueryComponent;
