const { ApiRequest } = require('./RequestService');
const { endpoints: { ADD_BLOG } } = require('../constant/endpoint')

const addBlog = (data) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  return ApiRequest('post', ADD_BLOG, data, headers)
}

export {
  addBlog
}