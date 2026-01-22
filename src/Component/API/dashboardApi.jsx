import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/dashboard`;


// ✅ GET DASHBOARD STATS API (GET)
export const getDashboardStats = () => {
    return axios.get(`${BASE_URL}/stats`);
};