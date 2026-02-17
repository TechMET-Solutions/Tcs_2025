import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/product`;

// ✅ ADD PRODUCT API (POST)
export const addProductAPI = (data) => {

    return axios.post(`${BASE_URL}/add`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// ✅ GET PRODUCT LIST API (GET)
export const getProductAPI = () => {
    return axios.get(`${BASE_URL}/list`);
};

// ✅ SEARCH PRODUCT API (GET)
export const searchProductAPI = (searchTerm) => {
    return axios.get(`${BASE_URL}/list`, {
        params: {
            q: searchTerm
        }
    });
};

export const updateProductAPI = (id, formData) => {
    return axios.put(`${BASE_URL}/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};