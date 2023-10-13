import React, { useState, useContext, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { addNode } from '../services/api';
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'
import { Modal, Button } from 'react-bootstrap';
import './css/addNode.css'

export default function AddNode() {
  return (
    <div>
      <SnackbarProvider component={CustomSnackbarComponent} timeout={10000} pauseOnHover={true} dismissable={true}>
        <AddNodeContainer />
      </SnackbarProvider>
    </div>
  );
}

const AddNodeContainer = wrapComponent(({ createSnackbar }) => {
  const {isAuthenticated } = useContext(AuthContext);
  const [node_Name, setnode_Name] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [terminalType, setTeminalType] = useState('');
  const [accessType, setAccessType] = useState('');
  const [location, setNodeLocation] = useState('');
  const [redirect, setRedirect] = useState(false);
  const loadingBarRef = useRef(null); 
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const [modalMessage, setModalMessage] = useState(''); // State to store the message for the modal


  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setModalMessage('');
    setShowModal(false);
  };


  const showError = (msg) => {
    createSnackbar({
      data: {
        action: 'Retry'
      },
      theme: 'error',
      message: 'Error Adding Node: ' + msg
    });
  }

  const showSuccess = (msg) => {
    createSnackbar({
      data: {
        action: 'Retry'
      },
      theme: 'success',
      message: msg
    });
  }

  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      // do something else
      if (loadingBarRef.current != null)
        loadingBarRef.current.complete();
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      if (loadingBarRef.current != null)
        loadingBarRef.current.continuousStart();
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loadingBarRef.current != null)
      loadingBarRef.current.continuousStart();
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      formData.append('name', node_Name);
      formData.append('node_description', nodeDescription);
      formData.append('location', location);
      formData.append('node_active', isActive);
      formData.append('terminal_type', terminalType);
      formData.append('access_type', accessType);

      var ret = await addNode(formData, token);
      if (ret.state == 'FAILED') {
        showError(ret.message);
      } else {
        handleShowModal(ret.message)
        // showSuccess(ret.message);
      }
      // setRedirect(true);
    } catch (error) {
      console.log(error);
      showError('Unknown error');
    }

    if (loadingBarRef.current != null)
      loadingBarRef.current.complete();
  };

  const handleFetchLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNodeLocation(`${latitude}, ${longitude}`);
          console.log(`${latitude}, ${longitude}`)
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };



  if (!isAuthenticated) {
    return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
  }

  if (redirect) {
    // alert("Successful");
    // return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
      <h1>Add a new Node</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="node_Name">Node Name</label>
          <input
            type="text"
            className="form-control"
            id="node_Name"
            value={node_Name}
            onChange={(event) => setnode_Name(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nodeDescription">Description of Node</label>
          <input
            type="text"
            className="form-control"
            id="nodeDescription"
            value={nodeDescription}
            onChange={(event) => setNodeDescription(event.target.value)}
          />
        </div>



        <div className="form-group">
          <label htmlFor="location">Location</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="location"
              value={location}
              onChange={(event) => setNodeLocation(event.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFetchLocation}
            >
            Location
            </button>
          </div>
        </div>


<div className="form-group">
  <label htmlFor="terminalType">Terminal Type</label>
  <select
    className="form-control"
    id="terminalType"
    value={terminalType}
    onChange={(event) => setTeminalType(event.target.value)}
  >
    <option value="">--Select a Type--</option>
    <option value="Resedential">Resedential</option>
    <option value="RV">RV </option>
    <option value="Aviation">Aviation</option>
    <option value="Maritime">Maritime</option>
    <option value="Others">Others</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="accessType">Access Type</label>
  <select
    className="form-control"
    id="accessType"
    value={accessType}
    onChange={(event) => setAccessType(event.target.value)}
  >
    <option value="">--Select a Type--</option>
    <option value="Public">Public</option>
    <option value="Private">Private </option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="isActive">Status : Active</label>
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      id="isActive"
      checked={isActive}
      onChange={(event) => setIsActive(event.target.checked)}
    />
  </div>
</div>

<Modal show={showModal} onHide={handleHideModal} animation={false} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Access Token</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-message">{modalMessage}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleHideModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                navigator.clipboard.writeText(modalMessage);
                alert('Access token copied! Remember not to share it with anyone.');
              }}
            >
              Copy
            </Button>
          </Modal.Footer>
        </Modal>


<button type="submit" className="btn btn-primary">
  Add Node
</button>
</form>
</div>
  );
});
// export default AddNode;

