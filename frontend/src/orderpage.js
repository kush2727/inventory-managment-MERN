import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const OrderPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        productId: '',
        quantity: 0,
        address: ''
    });

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products/'); // Adjust the endpoint as needed
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = (event) => {
        const selectedProductId = parseInt(event.target.value);
        setSelectedProduct(selectedProductId);
        const product = products.find(p => p.id === selectedProductId);
       
        setProductPrice(product ? product.price : '');
        setFormData({ ...formData, productId: selectedProductId });
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await axios.post(`http://localhost:3000/sales/`, {...formData},{
                headers:{
                    'Content-Type': 'application/json',
                }
              });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to place the order. Please try again.');
        }
    };

    return (
        <div>
            <header className="bg-primary text-white text-center py-4">
                <h1 className="display-4">Order Page</h1>
            </header>

            <main className="container mt-5">
                {!isSubmitted ? (
                    <div id="orderFormContainer">
                        <div className="text-center mb-4">
                            <Link to="/" className="btn btn-secondary btn-lg">
                                <i className="bi bi-arrow-left"></i> Back to Home
                            </Link>
                        </div>

                        <form id="orderForm" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="customerName" className="form-label">Customer Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="customerEmail" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="product" className="form-label">Product</label>
                                    <select
                                        id="product"
                                        className="form-control"
                                        value={selectedProduct}
                                        onChange={handleProductChange}
                                        required
                                    >
                                        <option value="">Select a product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="productPrice" className="form-label">Product Price</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productPrice"
                                        value={productPrice}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="address" className="form-label">Shipping Address</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary btn-lg">Submit Order</button>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div id="successMessage" className="text-center mt-5">
                        <div className="alert alert-success" role="alert">
                            <h4 className="alert-heading">Order Placed Successfully!</h4>
                            <p>Your order has been successfully placed. Thank you for shopping with us!</p>
                            <Link to="/" className="btn btn-primary">Back to Home</Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderPage;
