import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Table, Button } from "react-bootstrap";
import { fetchCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css"

function CartPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },);

  const handleIncrease = (id) => dispatch(incrementQuantity(id));
  const handleDecrease = (id) => dispatch(decrementQuantity(id));
  const handleRemove = (id) => dispatch(removeFromCart(id));
  const handleClear = () => dispatch(clearCart());

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0)
    return (
      <Container className="mt-5">
        <h3>Shopping Cart</h3>
        <p>Your cart is empty.</p>
      </Container>
    );

  return (
    <Container className="mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">🛒 Shopping Cart</h3>
        <Button variant="outline-danger" onClick={handleClear}>
          Clear Cart
        </Button>
      </div>

      <Table responsive bordered hover className="align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Product</th>
            <th className="text-end">Price</th>
            <th className="text-center">Quantity</th>
            <th className="text-end">Subtotal</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td>{idx + 1}</td>

              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    width="60"
                    height="60"
                    className="me-3 rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="fw-medium">{item.title}</span>
                </div>
              </td>

              <td className="text-end">₹{item.price}</td>

              <td className="text-center">
                <div className="d-inline-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleDecrease(item.pid)}
                  >
                    −
                  </Button>
                  <span className="fw-bold">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleIncrease(item.pid)}
                  >
                    +
                  </Button>
                </div>
              </td>

              <td className="text-end">
                ₹{item.price * item.quantity}
              </td>

              <td className="text-center">
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mt-4">
        <div className="text-end">
          <h4 className="fw-bold mb-3">Total: ₹{total}</h4>
          <Button
            size="lg"
            variant="success"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default CartPage;
