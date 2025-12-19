import axios from "axios";

const BASE_URL = "http://localhost:5000/api/Quotation";
export const getAllQuotations = async () => {
  return await axios.get(`${BASE_URL}/list`);
};
export const createDeliveryChallan = async (payload) => {
  return axios.post(`${BASE_URL}/generate-dc`, payload);
};
export const getAllDeliveryChallan = () =>
    axios.get(`${BASE_URL}/delivery-challan/list`);
