import axios from 'axios';

const api = axios.create({
    baseURL: 'https://jhsims-api.onrender.com/api', // ✅ Must be this
});

export default api;