import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const ApiRequest = async (method, url, data, headers) => {
  if (!headers) {
    headers = prepareHeader().headers
  }
  const config = {
    method,
    url,
    headers,
    baseURL,
  }
  if (data) {
    config.data = data;
  }
  try {
    const response = await axios(config);
    console.log("response", response);
    return response.data;
  } catch (e) {
    console.log("e.response.data", e.response?.data);
    throw e.response?.data || e;
  }
}

const prepareHeader = () => {
  const token = localStorage.getItem('snss_admin_token');
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}