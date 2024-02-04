import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { AuthContext } from "../AuthContext";


const Login = () => {
  
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/my-experiments');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      const response = await login(formData);
      setIsAuthenticated(true);
      localStorage.setItem('access', response.access_token);
      localStorage.setItem('refresh', response.refresh_token);
      setWelcomeMessage("You have successfully logged in, Welcome.");
      setTimeout(() => {
        setWelcomeMessage('');
      }, 3000);
      navigate("/my-experiments");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container text-center">
      <Form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {welcomeMessage && <div>{welcomeMessage}</div>}
        {error && <div>{error}</div>}
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
