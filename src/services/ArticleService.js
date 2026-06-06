const { ApiRequest } = require('./RequestService');
const { endpoints: { ADD_ARTICLE, GET_ARTICLES, UPDATE_ARTICLE, GET_ARTICLE } } = require('../constant/endpoint')

const addArticle = (data) => {
    return ApiRequest('post', ADD_ARTICLE, data)
}

const getArticles = (data) => {
    return ApiRequest('get', `${GET_ARTICLES}?is_admin=true`, null, null)
}

const updateArticle = (data) => {
    return ApiRequest('put', UPDATE_ARTICLE, data)
}

const getArticleDetail = (uuid) => {
    return ApiRequest('get', `${GET_ARTICLE}?uuid=${uuid}`, null, null)
}


export {
    addArticle,
    getArticles,
    updateArticle,
    getArticleDetail
}
