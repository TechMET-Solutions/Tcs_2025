import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/tracking`;

export const getTrackingByChallan = (challanId) =>
    axios.get(`${BASE_URL}/${challanId}`);

export const addTracking = (data) =>
    axios.post(`${BASE_URL}`, data);

export const deleteTracking = (id) =>
    axios.delete(`${BASE_URL}/${id}`);
