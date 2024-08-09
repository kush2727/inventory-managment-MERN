import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const OrderPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
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
                                    <label htmlFor="orderName" className="form-label">Customer Name</label>
                                    <input type="text" className="form-control" id="orderName" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="orderEmail" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="orderEmail" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="orderProduct" className="form-label">Product</label>
                                    <input type="text" className="form-control" id="orderProduct" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="orderQuantity" className="form-label">Quantity</label>
                                    <input type="number" className="form-control" id="orderQuantity" required />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="orderAddress" className="form-label">Shipping Address</label>
                                    <textarea className="form-control" id="orderAddress" rows="3" required></textarea>
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
