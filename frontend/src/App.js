import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import ScheduleExperiments from './components/ScheduleExperiments';
import AddNode from './components/AddNode';
import ViewMyNodes from './components/ViewMyNodes';
import MyExperiments from './components/MyExperiments';
import MyExperimentRuns from './components/MyExperimentRuns';
import ViewRunDetails from './components/ViewRunDetails'; 
import ViewScheduleCalender from './components/ViewScheduleCalender'; 

// Main application component
const App = () => {

  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <Router>
      {/* Rendering the navigation bar */}
      <Navbar />
      <Routes>
        {/* Defining routes for different components */}
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/schedule-experiments' element={<ScheduleExperiments />} />
        <Route path='/add-node' element={<AddNode />} />
        <Route path='/view-nodes' element={<ViewMyNodes />} />
        <Route path='/my-experiments' element={<MyExperiments />} />
        <Route path='/view-all-runs' element={<MyExperimentRuns/>} />
        {/* Dynamic route for viewing specific experiment run */}
        <Route path="/view-all-runs/:runId" element={<ViewRunDetails />} /> 
        <Route path='/view-schedule-calender' element={<ViewScheduleCalender/>} />

      </Routes>
    </Router>
  );
};

export default App;
