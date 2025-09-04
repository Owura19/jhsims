// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'https://jhsims-api.onrender.com/api', // ✅ Replace localhost
});

export default api;