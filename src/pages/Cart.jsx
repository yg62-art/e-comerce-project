import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);

    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Shopping Cart is Empty</h2>
        <p className="text-muted">You haven't added any products to your cart yet.</p>
        <Button as={Link} to="/products" variant="primary">Browse Products</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td className="align-middle">
                <img src={item.thumbnail} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} className="me-2" />
                {item.title}
              </td>
              <td className="align-middle">${item.price}</td>
              <td className="align-middle">
                <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</Button>
              </td>
              <td className="align-middle">${(item.price * item.quantity).toFixed(2)}</td>
              <td className="align-middle">
                <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Card className="p-3 mt-4 shadow-sm">
        <Row className="align-items-center">
          <Col md={8}>
            <h4>Total Amount: <span className="text-success">${totalPrice.toFixed(2)}</span></h4>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="success" size="lg" className="w-100" onClick={() => alert('Checkout completed successfully!')}>
              Checkout
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}