import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    signup(name, email, password);
    navigate("/");
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}
    >
      <Card className="p-4 shadow-lg rounded-4" style={{ width: "28rem", background: "#fff" }}>
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#2575fc" }}>Create Account</h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="rounded-pill"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
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
                placeholder="Enter password"
                required
                className="rounded-pill"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-pill"
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                required
                className="rounded-pill"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirm(!showConfirm)}
                className="rounded-pill"
              >
                {showConfirm ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 py-2 fw-bold"
            style={{ background: "#2575fc", border: "none", borderRadius: "50px" }}
          >
            Signup
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <small>
            Already have an account? <Link to="/login" style={{ color: "#6a11cb" }}>Login</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}

export default Signup;
