import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/employees`;

export const loginAPI = async (data) => {
    const res = await axios.post(`${BASE_URL}/login`, data);
    return res.data;
};
