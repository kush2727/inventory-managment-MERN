import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { updateProduct, updateSale } from './service/service';

const exchangeRate = 83; // 1 USD = 83 INR

const SalesRecords = () => {
    const [salesData, setSalesData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [formData, setFormData] = useState({
        saleDate: '',
        saleProduct: '',
        
        saleQuantity: '',
        salePrice: '',
        saleCustomer: ''
    });
    const [editData, setEditData] = useState(
        {products:[]}
    );
    const [products, setProducts] = useState([]);
    const closeBtnRef = useRef();

    useEffect(() => {
        fetchSalesData();
        fetchProducts();
    }, []);

    useEffect(() => {
        // Check if products array is not empty and contains items
        if (editData.products && editData.products.length > 0) {
            // Set saleProduct to the ID of the first product
            setEditData(prevData => ({
                ...prevData,
                saleProduct: prevData.products[0].id
            }));
        }
    }, [editData.products]); 

    const fetchSalesData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/sales');
            setSalesData(response.data);
            calculateTotalAmount(response.data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handelFormReset = (e) => {
        e.preventDefault();
        fetchSalesData();
        setFormData({
            saleDate: '',
            saleProduct: '',
            saleQuantity: '',
            salePrice: '',
            saleCustomer: ''
        });
    };

    const fetchProductsByFields = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/sales/fetchByField', data);
            setSalesData(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    

    const calculateTotalAmount = (data) => {
        const total = data.reduce((sum, sale) => sum + (parseFloat(sale?.products[0]?.price) * parseInt(sale.saleQuantity)), 0);
        setTotalAmount(total);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
           await fetchProductsByFields(formData); // Refresh sales data
        } catch (error) {
            console.error('Error submitting sale:', error);
        }
    };

    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
        try {
            await axios.delete(`http://localhost:3000/sales/${id}`);
            fetchSalesData(); // Refresh sales data
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    }
    };

   

    const handelEditFormSubmit = async (e) => {
        e.preventDefault();
        const response = await updateSale(editData.id,editData)
      
        if(response){
            fetchSalesData();
            setEditData({
                products:[]
            });
            closeBtnRef.current.click()
        }


    }

    const getProductPrice = (data)=>{
    
        return products?.find((product)=>parseInt(data?.saleProduct) === product?.id)?.price
    }

    return (
        <div>
            <header className="bg-primary text-white text-center py-4">
                <h1 className="display-4">Sales Records</h1>
            </header>

            <main className="container mt-5">
                <div className="text-center mb-4">
                    <Link to="/" className="btn btn-secondary btn-lg">
                        <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Sales Form */}
                <form id="salesForm" onSubmit={handleFormSubmit} onReset={handelFormReset}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="saleDate" className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="saleDate"
                                value={formData.saleDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="saleProduct" className="form-label">Item Name</label>
                            <select
                                className="form-select"
                                id="saleProduct"
                                value={formData.saleProduct}
                                onChange={handleInputChange}
                                name='saleProduct'
                            >
                                <option value="" disabled>Choose item</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="saleQuantity" className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                id="saleQuantity"
                                value={formData.saleQuantity}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="salePrice" className="form-label">Price</label>
                            <input
                                type="text"
                                className="form-control"
                                id="salePrice"
                                value={getProductPrice(formData)}
                                // onChange={handleInputChange}
                                disabled
                                readOnly
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label htmlFor="saleCustomer" className="form-label">Customer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="saleCustomer"
                                value={formData.saleCustomer}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="d-flex flex-row justify-content-between align-items-start">
                            <button type="submit" className="btn btn-primary btn-lg mb-3">Submit Sale</button>
                            <button type="reset" className="btn btn-primary btn-lg">Reset Form</button>
                        </div>
                    </div>
                </form>

                {/* Total Amount */}
                <div className="text-end mt-4">
                    <h4>Total Amount: <span id="totalAmount">₹{totalAmount.toFixed(2)}</span></h4>
                </div>

                {/* Sales Data Table */}
                <table className="table table-striped mt-5 text-center table-bordered">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Customer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="salesData">
                        {salesData.map((sale, index) => (
                            <tr key={sale.id}>
                                <td>{index + 1}</td>
                                <td>{sale.saleDate}</td>
                                <td>{sale.products[0]?.name}</td>
                                <td>{sale.saleQuantity}</td>
                                <td>{sale.products[0]?.price}</td>
                                <td>{sale.saleCustomer}</td>
                                <td>
                                    <button
                                        className="btn btn-warning me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editSalesModal"
                                        onClick={() => setEditData(sale)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(sale.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {/* Edit Sales Modal */}
            <div className="modal fade" id="editSalesModal" tabIndex="-1" aria-labelledby="editSalesModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editSalesModalLabel">Edit Sale</h5>
                            <button type="button" ref={closeBtnRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="editSalesForm" onSubmit={handelEditFormSubmit}>
                                <input type="hidden" id="editSaleId" value={editData?.id || ''} />
                                <div className="mb-3">
                                    <label htmlFor="editSaleProduct" className="form-label">Item Name</label>
                                    <select
                                        className="form-select"
                                        id="editSaleProduct"
                                        value={editData?.saleProduct || editData?.products[0]?.id || ''}
                                        onChange={(e) => setEditData({ ...editData, saleProduct: parseInt(e.target.value) })}
                                        defaultValue={editData?.products[0]?.id}
                                    >
                                        <option value="" disabled>Choose item</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editSaleQuantity" className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="editSaleQuantity"
                                        value={editData?.saleQuantity || ''}
                                        onChange={(e) => setEditData({ ...editData, saleQuantity: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editSalePrice" className="form-label">Price</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        id="editSalePrice"
                                        value={ getProductPrice(editData)
                                        }
                                        // onChange={(e) => setEditData({ ...editData, salePrice: e.target.value })}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="editSaleCustomer" className="form-label">Customer Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editSaleCustomer"
                                        value={editData?.saleCustomer || ''}
                                        onChange={(e) => setEditData({ ...editData, saleCustomer: e.target.value })}
                                    />
                                </div>
                                <div className="text-end ms-3 me-3">
                                    <button type="submit" className="btn btn-primary btn-custom">Update Sale</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesRecords;
