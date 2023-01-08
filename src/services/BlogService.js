const { ApiRequest } = require('./RequestService');
const { endpoints: { ADD_BLOG, GET_BLOGS, UPDATE_BLOG, GET_BLOG } } = require('../constant/endpoint')

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
  return ApiRequest('get', `${GET_BLOGS}?is_admin=true`, null, null)
}

const updateBlog = (data) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  return ApiRequest('put', UPDATE_BLOG, data, headers)
}

const getBlogDetail = (uuid) => {
  return ApiRequest('get', `${GET_BLOG}?uuid=${uuid}`, null, null)
}


export {
  addBlog,
  getBlogs,
  updateBlog,
  getBlogDetail
}