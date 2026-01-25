import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchTasks = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await axios.post(API_URL, taskData, getAuthHeaders());
  return res.data;
};

export const updateTask = async (id, updates) => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    updates,
    getAuthHeaders()
  );
  return res.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
