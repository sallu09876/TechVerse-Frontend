import { Row, Col, Container } from "react-bootstrap";
import ProductCard from "./ProductCard";
import "../styles/productList.css";

function ProductList({ products, title = "Our Products" }) {
  return (
    <section className="product-list-section">
      <Container className="my-5">
        <h2 className="section-title text-center mb-4">{title}</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((p) => (
            <Col key={p.id}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default ProductList;
