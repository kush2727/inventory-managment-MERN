import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { addProduct, updateProduct, deleteProduct, fetchProducts } from './service/service'; 

const AdminPanel = () => {
  const imageURL = 'http://localhost:3000/uploads/'
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    category: ''
  });
  const [imgPreview, setImgPreview] = useState('./image/default-item.webp');
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.price || !formData.category) {
      console.error('All fields are required');
      return;
    }
    const { name, quantity, price, category } = formData // Assuming formState holds your form values

    const productData = new FormData();
    productData.append('name', name);
    productData.append('quantity', quantity);
    productData.append('price', price);
    productData.append('category', category);
    productData.append('image',imgPreview)
   

    try {
      if (editMode) {
        const response = await updateProduct(items[currentItemIndex].id, productData);
        const arr = [...items]
        arr[currentItemIndex] = response.data;
        setItems([...arr]);
        
        
      } else {
        
        
        const response = await addProduct(productData);
        setItems([...items, response.data]);
      }
      setFormData({
        name: '',
        quantity: '',
        price: '',
        category: ''
      });
      setImgPreview('./image/default-item.webp');
      handleCloseModal();
      showSuccessMessage();
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleEdit = (index) => {
    setCurrentItemIndex(index);
    setFormData(items[index]);
    setImgPreview(items[index].image);
    setEditMode(true);
    setViewMode(false);
    setShowModal(true);
  };

  const handleView = (index) => {
    setCurrentItemIndex(index);
    setViewMode(true);
    setEditMode(false);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteProduct(items[index].id);
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setViewMode(false);
    setFormData({
      name: '',
      quantity: '',
      price: '',
      category: ''
    });
    setImgPreview('./image/default-item.webp');
  };

  return (
    <div>
      <header className="bg-primary text-white text-center py-4">
        <h1 className="display-4">Admin Panel</h1>
      </header>

      <main className="container mt-5">
        <div className="text-center mb-4">
          <Link to="/" className="btn btn-secondary btn-lg btn-back">
            <i className="bi bi-arrow-left"></i> Back to Home
          </Link>
        </div>

        {showSuccess && (
          <div id="successAlert" className="alert alert-success" role="alert">
            <i className="bi bi-check-circle"></i> Item saved successfully!
          </div>
        )}

        <section className="p-3">
          <div className="row mb-3">
            <div className="col-12">
              <button className="btn btn-primary newItem" onClick={() => {
                setEditMode(false);
                setViewMode(false);
                setShowModal(true);
              }}>
                New Item <i className="bi bi-box"></i>
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-striped table-hover text-center table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Picture</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><img src={`${imageURL}${item.image}`} alt="Item" width="80" height="80" style={{borderRadius:50}} /></td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>{item.category}</td>
                      <td>
                        <button className="btn btn-warning me-2" onClick={() => handleEdit(index)}>Edit</button>
                        <button className="btn btn-info me-2" onClick={() => handleView(index)}>View</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} id="itemForm" tabIndex="-1" aria-labelledby="itemFormLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-custom">
              <div className="modal-header">
                <h4 className="modal-title" id="itemFormLabel">
                  {editMode ? 'Edit Item' : viewMode ? 'View Item' : 'Add New Item'}
                </h4>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {viewMode ? (
                  <div>
                    <div className="card imgholder">
                      <img src={imageURL+items[currentItemIndex]?.image} alt="Item" width="200" height="200" className="img" />
                    </div>
                    <div className="inputField">
                      <div><strong>Item Name:</strong> {items[currentItemIndex]?.name}</div>
                      <div><strong>Quantity:</strong> {items[currentItemIndex]?.quantity}</div>
                      <div><strong>Price:</strong> {items[currentItemIndex]?.price}</div>
                      <div><strong>Category:</strong> {items[currentItemIndex]?.category}</div>
                    </div>
                  </div>
                ) : (
                  <form id="myForm" onSubmit={handleSubmit}>
                    <div className="card imgholder">
                      <label htmlFor="imgInput" className="upload">
                        <input type="file" id="imgInput" onChange={handleImageChange} />
                        <i className="bi bi-plus-circle-dotted"></i>
                      </label>
                      <img src={imgPreview} alt="Item" width="200" height="200" className="img" />
                    </div>
                    <div className="inputField">
                      <div>
                        <label htmlFor="name">Item Name:</label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                          type="number"
                          id="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="price">Price:</label>
                        <input
                          type="text"
                          id="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="category">Category:</label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>Select a category</option>
                          <option value="shoes">Shoes</option>
                          <option value="jackets">Jackets</option>
                          <option value="trousers">Trousers</option>
                          <option value="t-shirts">T-Shirts</option>
                          <option value="sweatshirts">Sweatshirts</option>
                          <option value="shirts">Shirts</option>
                          <option value="accessories">Accessories</option>
                          <option value="mobiles">Phones</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-end ms-3 me-3">
                      <button type="submit" className="btn btn-primary submit">
                        {editMode ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
