import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { AuthContext } from "../AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <Button color="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
