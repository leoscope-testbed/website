import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { getUserProfile } from '../services/api';
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'

export default function Profile() {
  return (
    <div>
      <SnackbarProvider component={CustomSnackbarComponent} timeout={10000} pauseOnHover={true}>
        <ProfileContainer />
      </SnackbarProvider>
    </div>
  );
}

const ProfileContainer = wrapComponent( ({ createSnackbar }) => {
  const [user, setUser] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const loadingBarRef = useRef(null); 

  useEffect(() => {
    const fetchProfile = async () => {
      if (loadingBarRef.current != null)
        loadingBarRef.current.continuousStart();
      try {
        const token = localStorage.getItem('access');
        const response = await getUserProfile(token);
        console.log(response)
        setUser(response);
      } catch (error) {
        console.log(error);
      }
      if (loadingBarRef.current != null)
        loadingBarRef.current.complete();
    };
  
    const token = localStorage.getItem('access');
    console.log(token)
    if (token) {
      // console.log("hello")
      fetchProfile();
    }
  }, [loadingBarRef]);

  if (!isAuthenticated) {
    // return <p>You must be authenticated to view this page.</p>;
    return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
  }

  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
      {user ? (
        <>
          <h1>Welcome, {user.first_name}!</h1>
          <p>Email: {user.email}</p>
          <p>First Name: {user.first_name}</p>
          <p>Last Name: {user.last_name}</p>
          <p>Your Location: {user.location}</p>
          <p>Organisation: {user.organisation}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
});

// export default Profile;
