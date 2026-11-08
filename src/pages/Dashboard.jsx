import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import API from '../services/api';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const localProducts = JSON.parse(localStorage.getItem('dashboard_products'));
      if (localProducts) {
        setProducts(localProducts);
      } else {
        const response = await API.get('/products?limit=5');
        setProducts(response.data.products);
        localStorage.setItem('dashboard_products', JSON.stringify(response.data.products));
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !price) return;

    let updatedProducts;
    if (isEditing) {
      updatedProducts = products.map(p => p.id === currentId ? { ...p, title, price: Number(price) } : p);
    } else {
      const newProduct = {
        id: Date.now(),
        title,
        price: Number(price),
      };
      updatedProducts = [newProduct, ...products];
    }

    setProducts(updatedProducts);
    localStorage.setItem('dashboard_products', JSON.stringify(updatedProducts));
    handleCloseModal();
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('dashboard_products', JSON.stringify(updatedProducts));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setPrice('');
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Dashboard</h2>
          <p className="text-muted mb-0">CRUD Operations (Manage Products)</p>
        </div>
        <Button variant="success" onClick={() => setShowModal(true)}>Add New Product</Button>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#ID</th>
            <th>Name Of Product</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="align-middle">{product.id}</td>
              <td className="align-middle">{product.title}</td>
              <td className="align-middle">${product.price}</td>
              <td className="align-middle">
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(product)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter product name" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {isEditing ? 'Update Product' : 'Save Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}