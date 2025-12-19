import axios from "axios";

const BASE_URL = "http://localhost:5000/api/product";

// ✅ ADD PRODUCT API (POST)
export const addProductAPI = (data) => {
    console.log(data,"data")
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
