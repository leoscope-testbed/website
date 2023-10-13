import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { signup } from "../services/api";
import { AuthContext } from "../AuthContext";
import { redirect } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
    location: "",
    organisation: "",
    description: "",
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.re_password) {
      alert("Passwords do not match");
    } else {
      try {
        const response = await signup(formData);
        // localStorage.setItem("access", response.access);
        // setIsAuthenticated(true);
        navigate("/");
      } catch (error) {
        console.log(error);
        alert("Error creating account, please try again.");
      }
    }
  };

  return (
    <div className="container text-center">
    <Form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <FormGroup>
        <Label for="first_name">First Name</Label>
        <Input
          type="text"
          name="first_name"
          id="first_name"
          onChange={handleFormChange}
          value={formData.first_name}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="last_name">Last Name</Label>
        <Input
          type="text"
          name="last_name"
          id="last_name"
          onChange={handleFormChange}
          value={formData.last_name}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          onChange={handleFormChange}
          value={formData.email}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          onChange={handleFormChange}
          value={formData.password}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="re_password">Re-enter Password</Label>
        <Input
          type="password"
          name="re_password"
          id="re_password"
          onChange={handleFormChange}
          value={formData.re_password}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="location">Location</Label>
        <Input
          type="text"
          name="location"
          id="location"
          onChange={handleFormChange}
          value={formData.location}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="organisation">Organisation</Label>
        <Input
          type="text"
          name="organisation"
          id="organisation"
          onChange={handleFormChange}
          value={formData.organisation}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <Input
          type="text"
          name="description"
          id="description"
          onChange={handleFormChange}
          value={formData.description}
          required
        />
      </FormGroup>
      <Button color="primary" type="submit">
    Submit
  </Button>
</Form>
</div>
);
};
export default Signup;
