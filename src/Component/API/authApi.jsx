import axios from "axios";

const BASE_URL = "http://localhost:5000/api/employees";

export const loginAPI = async (data) => {
    const res = await axios.post(`${BASE_URL}/login`, data);
    return res.data;
};
