import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Spinner, Container } from "react-bootstrap";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const admin = localStorage.getItem("admin");

  if (admin) return <Navigate to="/admin" />;

  if (loading) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" style={{ color: "#17a2b8", width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3" style={{ color: "#555", fontSize: "1rem" }}>
          Checking authentication...
        </p>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
