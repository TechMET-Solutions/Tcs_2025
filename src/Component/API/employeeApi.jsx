import axios from "axios";

const BASE_URL = "http://localhost:5000/api/employees";

// ✅ CREATE EMPLOYEE
export const createEmployeeAPI = (data) => {
  return axios.post(`${BASE_URL}/create`, data);
};

// ✅ GET EMPLOYEES
export const getEmployeesAPI = () => {
  return axios.get(`${BASE_URL}/list`);
};

export const saveEmployeeRolesAPI = (payload) => {
    return axios.post(`${BASE_URL}/save`, payload);
};

export const getEmployeeRolesAPI = (employeeId) => {
    return axios.get(`${BASE_URL}/${employeeId}`);
};