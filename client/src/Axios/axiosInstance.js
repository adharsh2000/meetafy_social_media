import axios from 'axios'
import { USER_REFRESH_TOKEN, USER_TOKEN, baseURL } from '../Constants/Constants';

// const token = localStorage.getItem(USER_TOKEN);

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers.authorization = `Bearer ${localStorage.getItem(USER_TOKEN)}`
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN);
      const response = await axios.post('/api/refresh-token', { refreshToken });
      const { accessToken } = response.data;
      localStorage.setItem(USER_TOKEN, accessToken);

      originalRequest.headers.authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.log('Failed to refresh token:', refreshError);
    } finally {
      isRefreshing = false;
      refreshSubscribers.forEach(callback => callback(localStorage.getItem(USER_TOKEN)));
      refreshSubscribers = [];
    }
  }

  if (error.response.status === 500) {
    console.log('Internal server error!');
  }

  return Promise.reject(error);
});


export default axiosInstance;