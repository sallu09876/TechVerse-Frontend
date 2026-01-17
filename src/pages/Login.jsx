import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function Login() {
  const { login, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <Card
        className="p-4 shadow-lg rounded-4"
        style={{ width: "28rem", background: "#fff" }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#2575fc" }}>
          Log In
        </h3>

        {(error || authError) && (
          <Alert variant="danger" className="text-center">
            {error || authError}
          </Alert>
        )}

        {/* USER LOGIN FORM */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="rounded-pill"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="rounded-pill"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="rounded-pill"
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 py-2 fw-bold"
            style={{
              background: "#2575fc",
              border: "none",
              borderRadius: "50px",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>

        {/* USER LINKS */}
        <div className="mt-3 text-center">
          <small>
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#6a11cb" }}>
              Sign Up
            </Link>
          </small>
        </div>

        <div className="text-center mt-2">
          <Link to="/forgot-password" style={{ fontSize: "0.9rem", color: "#555" }}>
            Forgot password?
          </Link>
        </div>

        {/* DIVIDER */}
        <hr className="my-4" />

        {/* ADMIN LOGIN SECTION */}
        <div className="text-center">
          <p className="mb-2 fw-semibold text-muted">Are you an admin?</p>
          <Button
            variant="outline-danger"
            className="px-4 rounded-pill fw-bold"
            onClick={() => navigate("/admin-login")}
          >
            Log In as Admin
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default Login;
