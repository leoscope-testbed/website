import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { fetchExperiments, deleteExperiments} from '../services/api';
import './css/MyExperimentRuns.css';
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'

export default function MyExperiments() {
  return (
    <div>
      <SnackbarProvider component={CustomSnackbarComponent} timeout={10000} pauseOnHover={true} dismissable={true}>
        <MyExperimentsContainer />
      </SnackbarProvider>
    </div>
  );
}

const MyExperimentsContainer = wrapComponent(({ createSnackbar }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [experiments, setExperiments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperiments, setSelectedExperiments] = useState([]);
  const loadingBarRef = useRef(null); 

  const showError = (msg) => {
    createSnackbar({
      data: {
        action: 'Retry'
      },
      theme: 'error',
      message: 'Error: ' + msg
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
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, loadingBarRef]);

  const fetchData = async () => {
    if (loadingBarRef.current != null)
      loadingBarRef.current.continuousStart();
    try {
      const token = localStorage.getItem('access');
      const data = await fetchExperiments(token);
      setExperiments(data);
    } catch (error) {
      console.log(error);
      setExperiments([]);
    }
    if (loadingBarRef.current != null)
      loadingBarRef.current.complete();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event, experimentID) => {
    if (event.target.checked) {
      setSelectedExperiments((prevSelectedExperiments) => [
        ...prevSelectedExperiments,
        experimentID,
      ]);
    } else {
      setSelectedExperiments((prevSelectedExperiments) =>
        prevSelectedExperiments.filter((id) => id !== experimentID)
      );
    }
  };

  const handleDelete = async () => {
    if (selectedExperiments.length === 0) {
      showError('Please select at least one experiment to delete.');
      return;
    }
    
    if (loadingBarRef.current != null)
      loadingBarRef.current.continuousStart();

    try {
      const token = localStorage.getItem('access');

      const response = await deleteExperiments(selectedExperiments,token);
      if (response.error) {
        throw new Error(response.error);
      }
      showSuccess('Deleted experiments:' + response.data);
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.log(error);
      showError('An error occurred while deleting experiments.');
    }
    if (loadingBarRef.current != null)
      loadingBarRef.current.complete();
  };

  const filteredExperiments = experiments.filter((experiment) =>
    Object.values(experiment)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
  }

  return (
    <div className="container my-nodes">
      <h1>My Experiments</h1>
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
      <p>
        Click <a href={"/view-schedule-calender"} target="_blank" rel="noopener noreferrer">here</a> to view all scheduled experiments.
        For any assistance, please contact help@leoscope.org.
      </p>
      <button onClick={handleDelete} className="delete-button">Delete</button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: '95%' }} // Adjust the width value as desired
        />
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Experiment ID</th>
              <th>Experiment Name</th>
              <th>Owner (Username)</th>
              <th>Node</th>
              <th>schedule_cron_string</th>
              <th>Preferred Start Time</th>
              <th>Preferred End Time</th>
              <th>Reschedule Allowed</th>
              <th>Duration ~ seconds</th>
              <th>Overhead Experiment</th>
              <th>Server Details</th>
              <th>Trigger</th>
              <th>Approved Status</th>
              <th>Submit start_time</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredExperiments.map((experiment) => (
              <tr key={experiment.Experiment_ID}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedExperiments.includes(experiment.Experiment_ID)}
                    onChange={(event) =>
                      handleCheckboxChange(event, experiment.Experiment_ID)
                    }
                  />
                </td>
                <td>{experiment.Experiment_ID}</td>
                <td>{experiment.Experiment_Name}</td>
                <td>{experiment.owner}</td>
                <td>{experiment.Node}</td>
                <td>{experiment.schedule_cron_string}</td>
                <td>{experiment.preferred_start_time}</td>
                <td>{experiment.preferred_end_time}</td>
                <td>{experiment.isRescheduleAllowed}</td>
                <td>{experiment.Length}</td>
                <td>{experiment.isOverhead}</td>
                <td>{experiment.Server_Node}</td>
                <td>{experiment.Trigger}</td>
                <td>{experiment.isApproved}</td>
                <td>{experiment.submit_time}</td>
                <td>{experiment.last_updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// export default MyExperiments;
