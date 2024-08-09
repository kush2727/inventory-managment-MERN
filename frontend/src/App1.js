import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App1.css'; // Import custom CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Define the components for different pages
import AdminPanel from './adminpanel';
import OrderPage from './orderpage';
import Sales from './salerecords';

const Home = () => (
  <div className="App">
    <header className="bg-primary text-white text-center py-4">
      <div className="header-container">
        <h1 className="display-4 header-title">Inventory Management System</h1>
        <img src="./logo.png" alt="Logo" className="header-logo" />
      </div>
    </header>

    <main className="container mt-5">
      <div className="text-center mb-4">
        <p className="lead">
          Welcome to the Inventory Management System. Manage your inventory efficiently and effectively.
        </p>

        <div className="btn-container">
          <Link to="/adminpanel" className="btn btn-primary btn-lg">
            Go to Admin Panel <i className="bi bi-arrow-right"></i>
          </Link>
          <Link to="/order" className="btn btn-secondary btn-lg mt-3">
            <i className="bi bi-cart"></i> Place an Order
          </Link>
          <Link to="/sales" className="btn btn-success btn-lg">
            <i className="bi bi-bar-chart-line"></i> View Sales
          </Link>
        </div>
      </div>
    </main>

    <footer className="footer">  
      <p align="center">
        &copy; 2024 BODDU_KUSHWANTH_SAI <br /> All rights reserved.
      </p>
    </footer>
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adminpanel" element={<AdminPanel />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/sales" element={<Sales />} />
    </Routes>
  </Router>
);

export default App;
