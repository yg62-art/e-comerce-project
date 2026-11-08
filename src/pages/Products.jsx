import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Spinner, Button } from 'react-bootstrap';
import API from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
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

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Products List</h2>
      
      <Form.Control
        type="text"
        placeholder="Search for a product..."
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm d-flex flex-column">
                <Card.Img 
                  variant="top" 
                  src={product.thumbnail} 
                  style={{ height: '200px', objectFit: 'contain' }} 
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text className="text-muted">${product.price}</Card.Text>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    className="mt-3 w-100"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}