import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { fetchNodes } from '../services/api';
import './css/ViewMyNodes.css';
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'

const ViewMyNodes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [nodes, setNodes] = useState([]);
  const loadingBarRef = useRef(null); 

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    if (loadingBarRef.current != null)
      loadingBarRef.current.continuousStart();
    try {
      const token = localStorage.getItem('access');
      const data = await fetchNodes(token);
      setNodes(data);
    } catch (error) {
      console.log(error);
      setNodes([]);
    }

    if (loadingBarRef.current != null)
      loadingBarRef.current.complete();
  };

  if (!isAuthenticated) {
    return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
  }

  return (
    <div className="container my-nodes">
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
      <h1>My Nodes</h1>
      <p>
        Below is the table showing the various nodes you have added with their details.
        For any assistance, please contact help@leoscope.com.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Node ID</th>
            <th>Node Description</th>
            <th>Owner (Username)</th>
            <th>Location (Coordinates)</th>
            <th>Date Added</th>
            <th>Status Active</th>
            <th>Last Seen</th>
            <th>Last Status Change</th>
            <th>Terminal Type</th>
            <th>Access Type</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => (
            <tr key={node.id}>
              <td>{node.id}</td>
              <td>{node.node_description}</td>
              <td>{node.owner}</td>
              <td>{node.location}</td>
              <td>{node.date_added}</td>
              <td>{node.status_active ? 'Active' : 'Inactive'}</td>
              <td>{node.last_seen}</td>
              <td>{node.last_status_change}</td>
              <td>{node.terminal_type}</td>
              <td>{node.access_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMyNodes;
