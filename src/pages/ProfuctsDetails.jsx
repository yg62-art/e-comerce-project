import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product details', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = existingCart.findIndex(item => item.id === product.id);

    if (productIndex > -1) {
      existingCart[productIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`Added ${product.title} to cart!`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Product not found</h2>
        <Button variant="primary" onClick={() => navigate('/products')} className="mt-3">Back to Products</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/products')}>
        &larr; Back to Products
      </Button>
      <Row>
        <Col md={6} className="text-center">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="img-fluid rounded shadow-sm" 
            style={{ maxHeight: '400px', objectFit: 'contain' }} 
          />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h2>{product.title}</h2>
          <p className="text-muted mt-2">{product.description}</p>
          <h3 className="text-success my-3">${product.price}</h3>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Rating:</strong> {product.rating} / 5</p>
          <Button variant="primary" size="lg" className="mt-3" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
}