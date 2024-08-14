import axios from 'axios';

const api = axios.create({
  baseURL: 'https://409e57c8f41463270368e0fcea4e0bf3.serveo.net/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.map((callback) => callback(token));
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const isAuthorized = localStorage.authorized
    if(!isAuthorized){
      return
    }
    const originalRequest = error.config;
    if ((error.response || error.response.status === 400 || error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh-token');
        const response = await axios.post('http://localhost:4000/api/users/refresh-token', { refreshToken });

        const newAccessToken = response.data.access_token;
        localStorage.setItem('access-token', newAccessToken);
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        onRefreshed(newAccessToken);
        isRefreshing = false;
        refreshSubscribers = [];

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;