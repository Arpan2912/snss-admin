const { ApiRequest } = require('./RequestService');
const { endpoints: { ADD_BLOG, GET_BLOGS, UPDATE_BLOG } } = require('../constant/endpoint')

const addBlog = (data) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  return ApiRequest('post', ADD_BLOG, data, headers)
}

const getBlogs = (data) => {
  // const headers = {
  //   'Content-Type': 'multipart/form-data',
  // }
  return ApiRequest('get', GET_BLOGS, null, null)
}

const updateBlog = (data) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  return ApiRequest('put', UPDATE_BLOG, data, headers)
}

export {
  addBlog,
  getBlogs,
  updateBlog
}