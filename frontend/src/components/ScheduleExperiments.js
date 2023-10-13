import React, { useState, useContext, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { createExperiment } from '../services/api';
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'

export default function ScheduleExperiments() {
  return (
    <div>
      <SnackbarProvider component={CustomSnackbarComponent} timeout={10000} pauseOnHover={true} dismissable={true}>
        <ScheduleExperimentsContainer />
      </SnackbarProvider>
    </div>
  );
}

const ScheduleExperimentsContainer = wrapComponent( ({ createSnackbar }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [experimentName, setExperimentName] = useState('');
  const [cronString, setCronString] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowReschedule, setAllowReschedule] = useState(false);
  const [duration, setDuration] = useState('');
  const [serverDetails, setServerDetails] = useState('');
  const [overheadExperiment, setOverheadExperiment] = useState(false);
  const [node, setNode] = useState('');
  const [triggers, setTriggers] = useState('');
  // const [globalConfigFile, setGlobalConfigFile] = useState('');
  const [experimentConfigFile, setExperimentConfigFile] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  const loadingBarRef = useRef(null); 

  const showError = (msg) => {
    createSnackbar({
      data: {
        action: 'Retry'
      },
      theme: 'error',
      message: 'Error Scheduling Experiment: ' + msg
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
    loadingBarRef.current.continuousStart();
    try {
      const token = localStorage.getItem('access');
      const formData2 = new FormData();
      formData2.append('name', experimentName);
      formData2.append('cron_string', cronString);
      formData2.append('start_date', startDate);
      formData2.append('end_date', endDate);
      formData2.append('allow_reschedule', allowReschedule);
      formData2.append('experiment_duration', duration);
      formData2.append('server_details', serverDetails);
      formData2.append('overhead_experiment', overheadExperiment);
      formData2.append('node', node);
      formData2.append('trigger', triggers);
      // console.log('HIIII')
      // console.log(globalConfigFile)
      // console.log(experimentConfigFile)
      // formData2.append('global_config_file', globalConfigFile);
      formData2.append('experiment_config_file', experimentConfigFile);
      var ret = await createExperiment(formData2, token);
      console.log(ret)
      loadingBarRef.current.complete();
      if (ret.state == 'FAILED') {
        showError(ret.message);
      } else {
        showSuccess("Experiment Scheduled");
        // setRedirect(true);
      }
    } catch (error) {
      showError('Unknown Error');
      console.log(error);
    }
  };


  if (!isAuthenticated) {
    return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
  }

  if (redirect) {
    // alert("Successful");
    // showSuccess("Experiment Scheduled");
    // setRedirect(false);
    // return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
      <h1>Schedule Experiments</h1>
      <p>Click <a href={"/view-schedule-calender"} target="_blank" rel="noopener noreferrer">here</a> to view empty slots.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="experimentName">Experiment Name</label>
          <input
            type="text"
            className="form-control"
            id="experimentName"
            value={experimentName}
            onChange={(event) => setExperimentName(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cronString">CRON String</label>
          <input
            type="text"
            className="form-control"
            id="cronString"
            value={cronString}
            onChange={(event) => setCronString(event.target.value)}
          />
        </div>
        <div className="form-group">
  <label htmlFor="startDate">Preferred Start Date</label>
  <input
    type="datetime-local"
    className="form-control"
    id="startDate"
    value={startDate}
    onChange={(event) => setStartDate(event.target.value)}
  />
</div>

<div className="form-group">
  <label htmlFor="endDate">Preferred End Date</label>
  <input
    type="datetime-local"
    className="form-control"
    id="startDate"
    value={endDate}
    onChange={(event) => setEndDate(event.target.value)}
  />
</div>



<div className="form-group">
  <label htmlFor="duration">Duration of Experiment (in seconds)</label>
  <input
    type="number"
    className="form-control"
    id="duration"
    value={duration}
    onChange={(event) => setDuration(event.target.value)}
  />
</div>

<div className="form-group form-check">
  <input
    type="checkbox"
    className="form-check-input"
    id="overheadExperiment"
    value={overheadExperiment}
    onChange={() => setOverheadExperiment(!overheadExperiment)}
  />
  <label className="form-check-label" htmlFor="overheadExperiment">
    Overhead Experiment
  </label>
</div>

<div className="form-group">
  <label htmlFor="node">Node</label>
  <input
    type="text"
    className="form-control"
    id="node"
    value={node}
    onChange={(event) => setNode(event.target.value)}
  />
</div>


<div className="form-group">
  <label htmlFor="experimentConfig">Experiment Config File</label>
  <textarea
    className="form-control"
    id="experimentConfig"
    onChange={(event) => setExperimentConfigFile(event.target.value)}
  />
</div>
{/* <div className="form-group">
  <label htmlFor="globalConfig">Global Config File</label>
  <textarea
    className="form-control"
    id="globalConfig"
    onChange={(event) => setGlobalConfigFile(event.target.value)}
  />
</div> */}

<div className="form-group">
  <label htmlFor="triggers">Triggers</label>
  <input
    type="text"
    className="form-control"
    id="triggers"
    value={triggers}
    onChange={(event) => setTriggers(event.target.value)}
  />
</div>
<div className="form-group">
  <label htmlFor="allowReschedule">Allow Reschedule</label>
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      id="allowReschedule"
      checked={allowReschedule}
      onChange={(event) => setAllowReschedule(event.target.checked)}
    />
  </div>
</div>

<div className="form-group">
  <label htmlFor="serverDetails">Server (Node on which to run server-side code)</label>
  <input
    type="text"
    className="form-control"
    id="serverDetails"
    value={serverDetails}
    onChange={(event) => setServerDetails(event.target.value)}
  />
</div>

<br></br>

<button type="submit" className="btn btn-primary">
  Schedule Experiment
</button>
</form>
</div>
  );
});
// export default ScheduleExperiments;

