import axios from 'axios';
const API_URL = "http://localhost:5000/api/payment";

export const sendPaymentRequest = (data) => axios.post(`${API_URL}/request`, data);
export const updateRequestStatus = (requestId, status) => axios.put(`${API_URL}/update-status`, { requestId, status });
export const getPendingRequests = () => axios.get(`${API_URL}/pending`);