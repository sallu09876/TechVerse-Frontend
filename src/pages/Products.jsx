import { useState } from "react";
import { products } from "../data/products";
import ProductList from "../components/ProductList";
import { Container, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/products.css";

function Products() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category"); // get category from URL

    const [query, setQuery] = useState("");

    // Filter products by category and search query
    const filtered = products.filter((p) => {
        const matchCategory = category ? p.category === category : true;
        const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
        return matchCategory && matchQuery;
    });

    return (
        <Container className="mt-4">
            <div className="products-header text-center mb-4">
                <h2>{category ? category : "All Products"}</h2>
                <p>Search and explore our amazing products</p>
            </div>

            {/* Search Bar */}
            <InputGroup className="mb-4 search-bar">
                <InputGroup.Text style={{ background: "#17a2b8", color: "#fff", border: "none" }}>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ borderRadius: "0 8px 8px 0", borderLeft: "none" }}
                />
            </InputGroup>

            {/* Product List */}
            {filtered.length > 0 ? (
                <ProductList products={filtered} />
            ) : (
                <p className="text-center text-muted mt-5">No products found.</p>
            )}
        </Container>
    );
}

export default Products;
