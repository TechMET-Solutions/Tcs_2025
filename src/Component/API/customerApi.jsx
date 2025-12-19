import axios from "axios";

const BASE_URL = "http://localhost:5000/api/customers";

export const addCustomer = (data) => {
  return axios.post(`${BASE_URL}/add`, data);
};

export const getCustomers = () => {
  return axios.get(`${BASE_URL}/list`);
};

export const addFollowup = (data) => {
  return axios.post(`${BASE_URL}/followup/add`, data);
};

export const getFollowups = (id) => {
  return axios.get(`${BASE_URL}/followups/${id}`);
};
