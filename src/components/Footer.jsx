import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer mt-5 bg-dark text-white">
      <Container className="py-5">
        <Row>
          {/* Brand Info */}
          <Col md={4} className="mb-3">
            <h3 className="footer-brand">
              Tech<span className="text-info">Verse</span>
            </h3>
            <p>Your one-stop destination for quality products.</p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <div className="d-flex flex-column">
              <Button as={Link} to="/" variant="link" className="footer-link text-start p-0 mb-1">
                Home
              </Button>
              <Button as={Link} to="/products" variant="link" className="footer-link text-start p-0 mb-1">
                Products
              </Button>
              <Button as={Link} to="/orders" variant="link" className="footer-link text-start p-0 mb-1">
                My Orders
              </Button>
              <Button as={Link} to="/cart" variant="link" className="footer-link text-start p-0">
                Cart
              </Button>
            </div>
          </Col>

          {/* Support */}
          <Col md={4} className="mb-3">
            <h5>Support</h5>
            <p>
              <a href="mailto:support@techverse.com" className="footer-link">
                support@techverse.com
              </a>
            </p>
            <p>
              <a href="tel:+918590050875" className="footer-link">
                +91 85900 50875
              </a>
            </p>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <p className="text-center mb-0">
          © {new Date().getFullYear()} TechVerse. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
