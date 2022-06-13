import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate  } from "react-router-dom"
import {GoogleButton} from "react-google-button"
import {getUserEmail, userEmailArr, storeLogInTime} from "../db/Database"
import { auth } from "../firebase"

export default function Login(){
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  async function handleGoogleLogin(){
    setError("");

    try {
      setLoading(true);
      await googleLogin();
      navigate("/dashboard");
    } catch {
      setError("Failed to log in");
    }

    try {
      await getUserEmail();
    } catch {
      setError("Failed to get user data from database.");
    }

    const isUserExisted = userEmailArr.includes(auth.currentUser.email);
    if(!isUserExisted){storeLogInTime()};

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-2 mb-2" type="submit">
              Log In
            </Button>
            <GoogleButton className="w-100" onClick={handleGoogleLogin}/>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
