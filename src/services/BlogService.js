const { ApiRequest } = require('./RequestService');
const { endpoints: { ADD_BLOG, GET_BLOGS, UPDATE_BLOG, GET_BLOG } } = require('../constant/endpoint')

const addBlog = (data) => {
  return ApiRequest('post', ADD_BLOG, data)
}

const getBlogs = (data) => {
  return ApiRequest('get', `${GET_BLOGS}?is_admin=true`, null, null)
}

const updateBlog = (data) => {
  return ApiRequest('put', UPDATE_BLOG, data)
}

const getBlogDetail = (uuid) => {
  return ApiRequest('get', `${GET_BLOG}?url=${uuid}`, null, null)
}


export {
  addBlog,
  getBlogs,
  updateBlog,
  getBlogDetail
}