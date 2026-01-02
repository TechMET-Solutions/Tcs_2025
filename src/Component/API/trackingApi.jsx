import axios from "axios";

const BASE_URL = "http://localhost:5000/api/tracking";

export const getTrackingByChallan = (challanId) =>
    axios.get(`${BASE_URL}/${challanId}`);

export const addTracking = (data) =>
    axios.post(`${BASE_URL}`, data);

export const deleteTracking = (id) =>
    axios.delete(`${BASE_URL}/${id}`);
