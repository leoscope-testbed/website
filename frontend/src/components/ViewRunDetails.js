import { useParams } from 'react-router-dom';
import { fetchSpecificExperimentRun } from '../services/api';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const ViewRunDetails = () => {
  const { runId } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [runDetails, setRunDetails] = useState(null);

  // Fetch specific run details based on the runId and display the details
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access');
      const data = await fetchSpecificExperimentRun(token, runId);
      setRunDetails(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      setRunDetails(null);
    }
  };

  if (!isAuthenticated) {
    return <p>You must be authenticated to view this page.</p>;
  }

  return (
    <div>
      <h1>Run Details for Run ID: {runId}</h1>
      {runDetails ? (
        <div>
          <p>Experiment ID: {runDetails[0].Experiment_ID}</p>
          <p>Experiment Name: {runDetails[0].Experiment_Name}</p>
          <p>Owner: {runDetails[0].owner}</p>
          <p>Node: {runDetails[0].Node}</p>
          <p>Start Time: {runDetails[0].start_time}</p>
          <p>End Time: {runDetails[0].end_time}</p>
          <p>Status: {runDetails[0].status}</p>
          <p>Last Updated: {runDetails[0].last_updated}</p>
          {runDetails[0].experiment_data !== '-' ? (
            <a
              href={runDetails[0].experiment_data}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Data
            </a>
          ) : (
            <p>No data available</p>
          )}
        </div>
      ) : (
        <p>Loading run details...</p>
      )}
    </div>
  );
};

export default ViewRunDetails;
