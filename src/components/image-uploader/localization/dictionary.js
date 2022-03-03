import {
  DEFAULT_ERROR_MSG_CODE,
  IMAGE_UPLOAD_DIMENSIONS_TOO_SMALL,
  IMAGE_UPLOAD_WIDTH_TOO_SMALL,
  IMAGE_UPLOAD_HEIGHT_TOO_SMALL,
  IMAGE_UPLOAD_DIMENSIONS_TOO_BIG,
  IMAGE_UPLOAD_WIDTH_TOO_BIG,
  IMAGE_UPLOAD_HEIGHT_TOO_BIG,
  IMAGE_UPLOAD_DIMENSIONS_INVALID,
  IMAGE_UPLOAD_WIDTH_INVALID,
  IMAGE_UPLOAD_HEIGHT_INVALID,
  IMAGE_UPLOAD_SIZE_TOO_BIG,
  IMAGE_UPLOAD_ERROR,
  IMAGE_UPLOAD_INVALID_TYPE,
  IMAGE_PREVIEW_DELETE_ERROR,
} from '../const';

export default {
  [DEFAULT_ERROR_MSG_CODE]: 'Something went wrong. Please try again.',
  [IMAGE_UPLOAD_ERROR]: 'Upload failed.',
  [IMAGE_UPLOAD_SIZE_TOO_BIG]: ({ maxSize }) =>
    `Max allowed image size is ${maxSize / 1000000}MB!`,
  [IMAGE_UPLOAD_DIMENSIONS_TOO_SMALL]: ({ width, height }) =>
    `Image must be at least ${width}x${height}px!`,
  [IMAGE_UPLOAD_WIDTH_TOO_SMALL]: ({ width }) =>
    `Image width must be at least ${width}px!`,
  [IMAGE_UPLOAD_HEIGHT_TOO_SMALL]: ({ height }) =>
    `Image height must be at least ${height}px!`,
  [IMAGE_UPLOAD_DIMENSIONS_TOO_BIG]: ({ width, height }) =>
    `Image must not be more than ${width}x${height}px!`,
  [IMAGE_UPLOAD_WIDTH_TOO_BIG]: ({ width }) =>
    `Image width can be max ${width}px!`,
  [IMAGE_UPLOAD_HEIGHT_TOO_BIG]: ({ height }) =>
    `Image height can be max ${height}px!`,
  [IMAGE_UPLOAD_DIMENSIONS_INVALID]: ({ width, height }) =>
    `Image dimensions must be exactly ${width}x${height}px!`,
  [IMAGE_UPLOAD_WIDTH_INVALID]: ({ width }) =>
    `Image width must be exactly ${width}px!`,
  [IMAGE_UPLOAD_HEIGHT_INVALID]: ({ height }) =>
    `Image height must be exactly ${height}px!`,
  [IMAGE_UPLOAD_INVALID_TYPE]: 'File type is invalid.',
  [IMAGE_PREVIEW_DELETE_ERROR]: 'Delete failed.',
};
