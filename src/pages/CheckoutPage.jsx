import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearCart } from "../store/cartSlice";
import "../styles/checkoutp.css"

const USERS_API = `${import.meta.env.VITE_API_URL}/users`;

export default function CheckoutPage() {
  const [zoomImage, setZoomImage] = useState(null);
  const { items, totalQuantity } = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    city: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🟩 Get logged-in user (from localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (!address.name || !address.city || !address.pincode)
      return alert("Please fill all required fields");
    setStep(2);
  };

  // 🟨 Confirm & Save Order in user's document
  const handlePayment = async () => {
    if (!user) return alert("Please log in before placing order.");

    setLoading(true);
    try {
      const orderData = {
        id: Date.now(),
        items,
        totalQuantity,
        totalPrice,
        paymentMethod: payment,
        shippingAddress: address,
        status: "confirmed",
        date: new Date().toLocaleString(),
      };

      // Fetch the user from server
      const res = await axios.get(`${USERS_API}/${user.id}`);
      const userData = res.data;

      // Append the new order
      const updatedUser = {
        ...userData,
        orders: [...(userData.orders || []), orderData],
      };

      // Update in JSON Server
      await axios.put(`${USERS_API}/${user.id}`, updatedUser);

      // Clear cart and show confirmation
      dispatch(clearCart());
      setOrderId(orderData.id);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Step 1 — Cart + Address
  if (step === 1)
    return (
      <div className="container mt-5 mb-5">
        <h2 className="fw-bold mb-4">Checkout</h2>

        <div className="row g-4">
          {/* Order Summary */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">🛒 Order Summary</h5>

                <table className="table table-sm align-middle checkout-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="checkout-img"
                            onClick={() => setZoomImage(item.image)}
                            onError={(e) => {
                              e.target.src = "/images/placeholder.png";
                            }}
                          />
                        </td>
                        <td>{item.title}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr />
                <p><strong>Total Quantity:</strong> {totalQuantity}</p>
                <h5><strong>Total Price:</strong> ₹{totalPrice}</h5>
              </div>
            </div>
          </div>

          {/* Address Form */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">📍 Shipping Address</h5>

                <form onSubmit={handleSubmitAddress}>
                  <input className="form-control mb-2" name="name" placeholder="Full Name" onChange={handleAddressChange} required />
                  <input className="form-control mb-2" name="phone" placeholder="Phone Number" onChange={handleAddressChange} required />
                  <input className="form-control mb-2" name="house" placeholder="House / Street" onChange={handleAddressChange} />
                  <input className="form-control mb-2" name="city" placeholder="City" onChange={handleAddressChange} required />
                  <input className="form-control mb-3" name="pincode" placeholder="Pincode" onChange={handleAddressChange} required />

                  <button className="btn btn-primary w-100">
                    Continue to Payment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );


  // 🟢 Step 2 — Payment
  if (step === 2)
    return (
      <div className="container mt-5 mb-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <h4 className="mb-4">💳 Payment Method</h4>

            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" checked={payment === "cod"} value="cod" onChange={(e) => setPayment(e.target.value)} />
              <label className="form-check-label">Cash on Delivery</label>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="radio" checked={payment === "card"} value="card" onChange={(e) => setPayment(e.target.value)} />
              <label className="form-check-label">Credit / Debit Card (Mock)</label>
            </div>

            <button className="btn btn-success w-100" onClick={handlePayment} disabled={loading}>
              {loading ? "Processing…" : "Pay & Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    );


  // 🟢 Step 3 — Confirmation
  if (step === 3)
    return (
      <div className="container mt-5 mb-5 text-center">
        <div className="card shadow-sm mx-auto p-4" style={{ maxWidth: "500px" }}>
          <h2 className="text-success">✅ Order Confirmed</h2>
          <p className="mt-3">Thank you for your purchase!</p>

          <hr />

          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Total Paid:</strong> ₹{totalPrice}</p>

          <p className="text-muted mt-3">
            You can track your order in <strong>My Orders</strong>.
          </p>
        </div>
      </div>
    );

  // mobile
  <div className="checkout-cards">
    {items.map((item) => (
      <div key={item.id} className="card mb-3 shadow-sm">
        <div className="card-body d-flex gap-3 align-items-center">
          <img
            src={item.image}
            alt={item.title}
            className="checkout-img-lg"
            onClick={() => setZoomImage(item.image)}
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />

          <div>
            <h6 className="mb-1">{item.title}</h6>
            <p className="mb-1">Qty: {item.quantity}</p>
            <strong>₹{item.price * item.quantity}</strong>
          </div>
        </div>
      </div>
    ))}
  </div>

  // zoom
  {
    zoomImage && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ background: "rgba(0,0,0,0.7)", zIndex: 1050 }}
        onClick={() => setZoomImage(null)}
      >
        <img
          src={zoomImage}
          alt="Zoom"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
          }}
        />
      </div>
    )
  }


}
