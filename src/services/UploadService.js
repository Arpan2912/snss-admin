import axios from 'axios';
const { ApiRequest } = require('./RequestService');
const { endpoints: { GET_SIGNED_URL } } = require('../constant/endpoint');

/**
 * Get a presigned URL from the backend for direct S3 upload
 */
const getSignedUrl = (fileName, fileType) => {
  return ApiRequest('post', GET_SIGNED_URL, { fileName, fileType });
}

/**
 * Upload a single file directly to S3 using a presigned URL.
 * Returns { key, mimetype, size } for use in form submission.
 */
const uploadFileToS3 = async (file) => {
  // Step 1: Get presigned URL from our API
  const response = await getSignedUrl(file.name, file.type);
  const { uploadUrl, key } = response.data;

  // Step 2: Upload file directly to S3 using the presigned URL
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  // Step 3: Return the S3 key and metadata
  return {
    key,
    mimetype: file.type,
    size: file.size,
  };
}

/**
 * Upload multiple files to S3 in parallel.
 * Returns array of { key, mimetype, size }
 */
const uploadFilesToS3 = async (files) => {
  const uploads = Array.from(files).map((file) => uploadFileToS3(file));
  return Promise.all(uploads);
}

export {
  getSignedUrl,
  uploadFileToS3,
  uploadFilesToS3,
}
