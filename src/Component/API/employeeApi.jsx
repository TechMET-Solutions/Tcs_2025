import axios from "axios";

const BASE_URL = "http://localhost:5000/api/employees";

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
export const getEmployeesAPI = () => axios.get(`${BASE_URL}/list`);

// --- Employee Roles ---
export const saveEmployeeRolesAPI = (payload) => {
    return axios.post(`${BASE_URL}/save`, payload);
};

export const getEmployeeRolesAPI = (employeeId) => {
    return axios.get(`${BASE_URL}/${employeeId}`);
};