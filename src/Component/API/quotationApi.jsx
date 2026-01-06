import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/Quotation`;
export const getAllQuotations = async () => {
  return await axios.get(`${BASE_URL}/list`);
};
export const createDeliveryChallan = async (payload) => {
  return axios.post(`${BASE_URL}/generate-dc`, payload);
};
export const getAllDeliveryChallan = (page = 1, limit = 10) => {
    return axios.get(`${BASE_URL}/delivery-challan/list`, {
        params: { page, limit }
    });
};
