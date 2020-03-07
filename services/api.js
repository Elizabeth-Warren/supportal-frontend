import axios from 'axios';
import get from 'lodash/get';

const Auth = typeof window !== 'undefined' ? require('aws-amplify').Auth : null;

const baseURL = process.env.API_URL;
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};

const api = axios.create({ baseURL, headers });

// Add a request interceptor
api.interceptors.request.use(
  async config => {
    const newConfig = { ...config };
    let token;
    try {
      const session = await Auth.currentSession();
      token = get(session, 'idToken.jwtToken');
    } catch (err) {
      token = null;
    }
    if (token) {
      newConfig.headers = newConfig.headers || {};
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return newConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

// // Add a response interceptor
// api.interceptors.response.use(
//   response => {
//     // Do something with response data
//     return response;
//   },
//   error => {
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

export default api;
