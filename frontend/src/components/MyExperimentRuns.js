import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { fetchExperimentRuns } from '../services/api';
import './css/MyExperimentRuns.css';
import { Link } from 'react-router-dom'; 
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'

const MyExperimentRuns = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [experimentRuns, setExperimentRuns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      const data = await fetchExperimentRuns(token);
      setExperimentRuns(data);
    } catch (error) {
      console.log(error);
      setExperimentRuns([]);
    }
    if (loadingBarRef.current != null)
      loadingBarRef.current.complete();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredExperimentRuns = experimentRuns.filter((experimentRun) =>
    Object.values(experimentRun)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
  }

  return (
    <div className="container my-nodes">
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
      <h1>Experiment Runs</h1>
      <p>
        For any assistance, please contact help@leoscope.org.
      </p>
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
        <table>
          <thead>
            <tr>
              <th>Experiment Run ID</th>
              <th>Experiment ID</th>
              <th>Experiment Name</th>
              <th>Owner (Username)</th>
              <th>Node</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Experiment Status</th>
              <th>Last Updated</th>
              <th>Experiment Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredExperimentRuns.map((experimentRun) => (
              <tr key={experimentRun.Experiment_RUN_ID}>
                <Link to={`/view-all-runs/${experimentRun.Experiment_RUN_ID}`}>
                  {experimentRun.Experiment_RUN_ID}
                </Link>
                <td>{experimentRun.Experiment_ID}</td>
                <td>{experimentRun.Experiment_Name}</td>
                <td>{experimentRun.owner}</td>
                <td>{experimentRun.Node}</td>
                <td>{experimentRun.start_time}</td>
                <td>{experimentRun.end_time}</td>
                <td>{experimentRun.status}</td>
                <td>{experimentRun.last_updated}</td>
                <td>
                  {experimentRun.experiment_data !== '-' ? (
                    <a
                      href={experimentRun.experiment_data}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'Download Data'}
                    </a>
                  ) : (
                    'No data available'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyExperimentRuns;
