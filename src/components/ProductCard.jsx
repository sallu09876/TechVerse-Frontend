import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/productCard.css";

function ProductCard({ product }) {
  return (
    <Card className="product-card h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="product-title">{product.name}</Card.Title>
        <Card.Text className="product-description flex-grow-1">
          {product.description.slice(0, 60)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <strong className="product-price">₹{product.price}</strong>
          <Button
            as={Link}
            to={`/product/${product.id}`}
            className="view-btn"
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
