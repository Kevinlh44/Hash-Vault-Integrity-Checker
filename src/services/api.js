import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const scanFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/scan`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { error: 'Not found', status: 404 };
    }
    throw new Error(error.response?.data?.message || 'Failed to connect to scanner API');
  }
};

export const scanUrl = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scan-url`, { url });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { error: 'Not found', status: 404 };
    }
    throw new Error(error.response?.data?.message || 'Failed to connect to scanner API');
  }
};
