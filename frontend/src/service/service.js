import axios from 'axios';

export const addProduct = async (data) => {
    try {
        return await axios.post("http://localhost:3000/products", data, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const fetchProducts = async (data) => {
    try {
        return await axios.get("http://localhost:3000/products", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const updateProduct = async (id,data) => {
    try {
        
        return await axios.put("http://localhost:3000/products/"+id, data, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};
 
export const deleteProduct = async (id) => {
    try {
        return await axios.delete("http://localhost:3000/products/"+id, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const updateSale = async (saleId, updateData) => {
    try {
      const response = await axios.put(`http://localhost:3000/sales/${saleId}`, updateData,{
        headers:{
            'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        // Success
        alert('Sale updated successfully!');
        return response.data;
      } else {
        // Handle unexpected status codes
        alert('Unexpected response from server.');
        return null;
      }
    } catch (error) {
      // Error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(`Error: ${error.response.data.error || 'An error occurred'}`);
      } else if (error.request) {
        // No response received
        alert('Network error. Please try again later.');
      } else {
        // Error setting up the request
        alert('Error setting up request: ' + error.message);
      }
      return null;
    }
  };