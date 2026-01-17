import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ADMINS_API = `${import.meta.env.VITE_API_URL}/admins`;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await axios.get(
      `${ADMINS_API}?email=${email}&password=${password}`
    );

    if (res.data.length > 0) {
      localStorage.setItem("admin", JSON.stringify(res.data[0]));
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Admin Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Control
            className="mb-3"
            type="email"
            placeholder="Admin Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Control
            className="mb-3"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="dark" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
