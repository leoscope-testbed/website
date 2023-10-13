
import api from './api_config';


/**
 * Sign up a new user.
 * 
 * @param {Object} data - User data.
 * @returns {Promise<Object>} - Response data.
 * @throws {Error} - If signup fails.
 */

export const signup = async (data) => {
  try {
    // console.log(data)
    const response = await api.post('signup/', data);
    // console.log(response.data);
    // console.log(response);
    // localStorage.setItem('access', response.data.access_token);
    // localStorage.setItem('refresh', response.data.access_token);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

/**
 * Log in and obtain an access token.
 * 
 * @param {Object} formData - Form data including username and password.
 * @returns {Promise<Object>} - Token information.
 * @throws {Error} - If login fails.
 */

export const login = async (formData) => {
  try {
    const response = await api.post('login/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log(response)
    // console.log(response.data.access_token)
    localStorage.setItem('access', response.data.access_token);
    localStorage.setItem('refresh', response.data.refresh_token);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

/**
 * Log out the user.
 * 
 * @returns {Promise<Object>} - Logout response.
 */


export const logout = async () => {
  try {
    // const refresh = localStorage.getItem('refresh');
    // await api.post('logout/', { refresh });
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return { success: true };
  } catch (error) {
    // throw new Error(error.response.data);
  }
};


/**
 * Fetch calendar events.
 * 
 * @param {Object} data - Calendar data.
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} - Calendar events data.
 * @throws {Error} - If fetching calendar events fails.
 */


export const fetchCalendarEvents = async (data,token) => {
  try {
    const response = await api.post('fetch-calendar-events/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }

}

/**
 * Create a new experiment.
 * 
 * @param {Object} data - Experiment data.
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} - Experiment response.
 * @throws {Error} - If creating experiment fails.
 */

export const createExperiment = async (data, token) => {  
  try {
    const response = await api.post('experiments/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};


/**
 * Add a new node.
 * 
 * @param {Object} data - Node data.
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} - Node response.
 * @throws {Error} - If adding node fails.
 */

export const addNode = async (data, token) => {
  try {
    const response = await api.post('nodes/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

/**
 * Fetch nodes.
 * 
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - Array of node data.
 * @throws {Error} - If fetching nodes fails.
 */

export const fetchNodes = async (token) => {
  try {
    const response = await api.get('get-nodes/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log((response.data));
    // const data = await response.json();
    // console.log(data);
    return response.data
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Fetch experiment runs.
 * 
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - Array of experiment run data.
 * @throws {Error} - If fetching experiment runs fails.
 */

export const fetchExperimentRuns = async (token) => {
  try {
    const response = await api.get('get-my-experiment-runs/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log((response.data));
    // const data = await response.json();
    // console.log(data);
    return response.data
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Fetch experiments.
 * 
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - Array of experiment data.
 * @throws {Error} - If fetching experiments fails.
 */

export const fetchExperiments = async (token) => {
  try {
    const response = await api.get('get-my-experiments/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log((response.data));
    // const data = await response.json();
    // console.log(data);
    return response.data
  } catch (error) {
    console.log(error);
    return [];
  }
};



/**
 * Fetch specific experiment run details.
 * 
 * @param {string} token - Authentication token.
 * @param {string} runId - Experiment run ID.
 * @returns {Promise<Object>} - Experiment run details.
 * @throws {Error} - If fetching experiment run fails.
 */

export const fetchSpecificExperimentRun = async (token, runId) => {
  try {
    const response = await api.get(`get-specific-experiment-run/?runId=${runId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Delete experiments.
 * 
 * @param {Object} data - Experiment data.
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} - Response.
 * @throws {Error} - If deleting experiments fails.
 */

export const deleteExperiments = async (data, token) => {
  try {
    const response = await api.post('delete-experiments/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.response.data);
  }
};


/**
 * Get user profile.
 * 
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} - User profile data.
 * @throws {Error} - If fetching user profile fails.
 */

export const getUserProfile = async (token) => {
  try {
    // console.log(token)
    const response = await api.get('profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};


export default api;
