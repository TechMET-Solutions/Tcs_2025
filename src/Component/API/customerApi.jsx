import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/customers`;

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
