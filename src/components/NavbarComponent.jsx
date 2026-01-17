import { Navbar, Container, Nav, Button, Badge, NavDropdown, Modal } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { categories } from "../data/products";
import "../styles/nav.css";

function NavbarComponent() {
  const { user, logout } = useContext(AuthContext);
  const { totalQuantity } = useSelector((state) => state.cart);
  const [showProfile, setShowProfile] = useState(false);

  const handleClose = () => setShowProfile(false);
  const handleShow = () => setShowProfile(true);

  return (
    <>
      <Navbar expand="lg" className="main-navbar sticky-top shadow-sm bg-white py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo fw-bold fs-4">
            Tech<span className="text-info">Verse</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            {/* Left Nav Buttons */}
            <Nav className="me-auto gap-2">
              <NavLink to="/" className="nav-btn">Home</NavLink>
              <NavLink to="/products" className="nav-btn">Products</NavLink>
              <NavDropdown title="Categories" id="nav-dropdown" className="nav-btn-dropdown">
                {categories.map((cat) => (
                  <NavDropdown.Item
                    as={Link}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    key={cat.id}
                  >
                    {cat.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavLink to="/orders" className="nav-btn">My Orders</NavLink>
            </Nav>

            {/* Right Side */}
            <Nav className="align-items-center gap-3">
              <NavLink to="/cart" className="cart-btn d-flex align-items-center position-relative">
                <FaShoppingCart size={20} className="me-1" /> Cart
                {totalQuantity > 0 && (
                  <Badge pill bg="info" className="cart-badge position-absolute top-0 start-100 translate-middle">
                    {totalQuantity}
                  </Badge>
                )}
              </NavLink>

              {!user ? (
                <Button as={Link} to="/login" variant="info" className="d-flex align-items-center gap-1">
                  <FaUser /> Login
                </Button>
              ) : (
                <Button variant="outline-primary" onClick={handleShow} className="d-flex align-items-center gap-1">
                  <FaUser /> {user.name}
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile Modal */}
      {user && (
        <Modal show={showProfile} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <hr />
            <Button as={Link} to="/orders" variant="info" className="w-100 mb-2" onClick={handleClose}>
              View Orders
            </Button>
            <Button variant="outline-danger" className="w-100" onClick={() => { logout(); handleClose(); }}>
              Logout
            </Button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default NavbarComponent;
