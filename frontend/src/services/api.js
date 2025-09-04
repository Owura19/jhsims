// src/services/api.js

import axios from 'axios';

// Base API instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend
});

export default api;