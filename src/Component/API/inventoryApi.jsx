import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/purchase`;

export const addPurchaseAPI = (data) => {
  return axios.post(`${BASE_URL}/add`, data);
};

export const getPurchaseListAPI = (page = 1, limit = 10) => {
  return axios.get(`${BASE_URL}/list?page=${page}&limit=${limit}`);
};
export const getSinglePurchaseAPI = (id) =>
  axios.get(`${BASE_URL}/purchase/${id}`);