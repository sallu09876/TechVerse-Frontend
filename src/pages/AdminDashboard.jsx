import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";

const USERS_API = `${import.meta.env.VITE_API_URL}/users`;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(USERS_API).then((res) => setUsers(res.data));
  }, []);

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  const allOrders = users.flatMap((u) => u.orders || []);
  const confirmedOrders = allOrders.filter(
    (o) => o.status === "confirmed"
  );
  const cancelledOrders = allOrders.filter(
    (o) => o.status === "cancelled"
  );

  const revenue = confirmedOrders.reduce(
    (sum, o) => sum + o.totalPrice,
    0
  );

  return (
    <div className="admin-dashboard">
      <Container>
        {/* Header */}
        <div className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <Button variant="outline-danger" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card users">
            <h6>Total Users</h6>
            <h3>{users.length}</h3>
          </div>

          <div className="stat-card orders">
            <h6>Total Orders</h6>
            <h3>{allOrders.length}</h3>
          </div>

          <div className="stat-card confirmed">
            <h6>Confirmed Orders</h6>
            <h3>{confirmedOrders.length}</h3>
          </div>

          <div className="stat-card cancelled">
            <h6>Cancelled Orders</h6>
            <h3>{cancelledOrders.length}</h3>
          </div>

          <div className="stat-card revenue">
            <h6>Total Revenue</h6>
            <h3>₹{revenue}</h3>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-wrapper">
          <h4 className="mb-3">All Orders</h4>

          <Table hover responsive className="admin-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
                user.orders?.map((order) => (
                  <tr key={order.id}>
                    <td>{user.email}</td>
                    <td>#{order.id}</td>
                    <td>
                      <Badge
                        bg={
                          order.status === "cancelled"
                            ? "danger"
                            : "success"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="fw-bold">
                      ₹{order.totalPrice}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}
