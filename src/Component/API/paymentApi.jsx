import axios from 'axios';
import { BASEURL } from './Url';
const API_URL = `${BASEURL}/api/payment`;

export const sendPaymentRequest = (data) => axios.post(`${API_URL}/request`, data);
export const updateRequestStatus = (requestId, status) => axios.put(`${API_URL}/update-status`, { requestId, status });
export const getPendingRequests = () => axios.get(`${API_URL}/pending`);