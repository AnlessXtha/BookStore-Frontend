import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:5001/api', // Replace with your .NET backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Optional: for sending cookies (e.g., JWT)
});

export default axiosInstance;
