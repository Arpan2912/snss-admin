import axios from 'axios'
let baseURL = 'http://localhost:3000';
// baseURL = 'http://43.205.226.137:3001'
baseURL = 'https://www.snssindia.in'
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
  //   let userInfo = localStorage.getItem('userInfo');
  //   if (userInfo) {
  //     userInfo = JSON.parse(userInfo);

  return {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${userInfo.token}`,
    },
  }
  //   }
  //   return null;
}