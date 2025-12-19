import axios from "axios";

const BASE_URL = "http://localhost:5000/api/purchase";

export const addPurchaseAPI = (data) => {
  return axios.post(`${BASE_URL}/add`, data);
};

export const getPurchaseListAPI = () => {
  return axios.get(`${BASE_URL}/list`);
};

export const getSinglePurchaseAPI = (id) =>
  axios.get(`${BASE_URL}/purchase/${id}`);