import axios from 'axios';
import { BASEURL } from "./Url";
export const deleteTaskAPI = (taskId) => axios.delete(`${BASEURL}/api/tasks/${taskId}`);