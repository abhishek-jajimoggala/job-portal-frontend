import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getJobs = async () => {
  const response = await axios.get(
    `${API_URL}/jobs`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getJobById = async (id) => {
  const response = await axios.get(
    `${API_URL}/job/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const saveJob = async (jobId) => {
  const response = await axios.post(
    `${API_URL}/save-job/${jobId}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getSavedJobs = async () => {
  const response = await axios.get(
    `${API_URL}/saved-jobs`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const removeSavedJob = async (savedId) => {
  const response = await axios.delete(
    `${API_URL}/remove-saved-job/${savedId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};