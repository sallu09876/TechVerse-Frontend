import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { Container, Button, Row, Col, Image, Badge, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function ProductPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Scroll to top whenever the id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product)
    return <Container className="mt-4">Product not found</Container>;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        pid: product.id,
        title: product.name,
        price: product.price,
        image: product.image,
      })
    );
  };

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Product Image */}
        <Col md={5}>
          <div className="product-image-container shadow-sm rounded">
            <Image src={product.image} fluid className="rounded" />
          </div>
        </Col>

        {/* Product Details */}
        <Col md={7}>
          <h2 className="fw-bold mb-2">{product.name}</h2>

          {/* Badges */}
          <div className="mb-3">
            <Badge bg="success" className="me-2">Best Seller</Badge>
            <Badge bg="warning" text="dark">Limited Stock</Badge>
          </div>

          {/* Price */}
          <h3 className="text-success mb-3">₹{product.price}</h3>

          {/* Ratings */}
          <div className="mb-3">
            <span className="text-warning">⭐️⭐️⭐️⭐️☆</span> (120 Reviews)
          </div>

          {/* Product Description */}
          <p className="text-muted mb-4">{product.description}</p>

          {/* Features / Highlights */}
          <ul className="mb-4">
            <li>High-quality material</li>
            <li>1-year warranty</li>
            <li>Easy to use and maintain</li>
            <li>Fast shipping available</li>
          </ul>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mb-4">
            <Button onClick={handleAddToCart} variant="primary" size="lg">
              Add to Cart
            </Button>
            <Button variant="success" size="lg" onClick={() => { handleAddToCart(); navigate('/checkout'); }}>
              Buy Now
            </Button>
            <Button variant="outline-secondary" as={Link} to="/products">
              Back
            </Button>
          </div>
        </Col>
      </Row>

      {/* Related Products */}
      <section className="related-products mt-5">
        <h3 className="mb-4">You may also like</h3>
        <Row className="g-3">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <Col key={p.id} xs={6} md={3}>
                <Card className="shadow-sm h-100">
                  <Card.Img variant="top" src={p.image} />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6">{p.name}</Card.Title>
                    <Card.Text className="text-success fw-bold mb-2">₹{p.price}</Card.Text>

                    {/* View Product Button */}
                    <Button
                      variant="outline-primary"
                      className="mb-2"
                      onClick={() => {
                        navigate(`/product/${p.id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      View
                    </Button>

                    {/* Add to Cart Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        dispatch(
                          addToCart({
                            pid: p.id,
                            title: p.name,
                            price: p.price,
                            image: p.image,
                          })
                        );
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </section>

    </Container>
  );
}

export default ProductPage;
