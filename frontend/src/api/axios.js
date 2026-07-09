import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor to add the JWT token to every request automatically
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;