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