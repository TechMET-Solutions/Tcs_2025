import axios from "axios";
import { BASEURL } from "./Url";

const BASE_URL = `${BASEURL}/api/employees`;
const BASE_URL_ROLE = `${BASEURL}/api/roles`;
// Utility to handle FormData for file uploads
const prepareFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    return formData;
};

// --- Employee CRUD ---
export const createEmployeeAPI = (data) => axios.post(`${BASE_URL}/add`, prepareFormData(data));
export const updateEmployeeAPI = (id, data) => axios.put(`${BASE_URL}/update/${id}`, prepareFormData(data));
export const deleteEmployeeAPI = (id) => axios.delete(`${BASE_URL}/delete/${id}`);
export const toggleStatusAPI = (id, status) => axios.patch(`${BASE_URL}/status/${id}`, { status });
export const getEmployeesAPI = (page = 1, limit = 10) => 
  axios.get(`${BASE_URL}/list?page=${page}&limit=${limit}`);

export const getEmployeeRolesAPI = (id) => axios.get(`${BASE_URL_ROLE}/get-employee-roles/${id}`);
export const saveEmployeeRolesAPI = (data) => axios.post(`${BASE_URL_ROLE}/save-employee-roles`, data);