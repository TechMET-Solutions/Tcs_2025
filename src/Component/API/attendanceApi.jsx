import axios from "axios";
import { BASEURL } from "./Url";

const API_URL = `${BASEURL}/api/employees`;

/* 🔹 Punch In */
export const punchInAPI = (data) =>
    axios.post(`${API_URL}/punch-in`, data);

/* 🔹 Punch Out */
export const punchOutAPI = (data) =>
    axios.post(`${API_URL}/punch-out`, data);

/* 🔹 Month-wise Attendance */
export const getAttendanceAPI = (employeeId, month) =>
    axios.get(`${API_URL}/${employeeId}`, {
        params: { month },
    });

/* 🔹 Attendance Summary */
export const getAttendanceSummaryAPI = (employeeId, month) =>
    axios.get(`${API_URL}/attendance-summary/${employeeId}`, {
        params: { month },
    });
