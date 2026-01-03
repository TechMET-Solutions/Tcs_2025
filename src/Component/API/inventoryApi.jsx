import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/purchase`;

export const addPurchaseAPI = (data) => {
  return axios.post(`${BASE_URL}/add`, data);
};

export const getPurchaseListAPI = () => {
  return axios.get(`${BASE_URL}/list`);
};

export const getSinglePurchaseAPI = (id) =>
  axios.get(`${BASE_URL}/purchase/${id}`);