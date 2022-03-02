import { getMessage } from './localization';
import {
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
  IMAGE_PREVIEW_DELETE_ERROR,
} from './const';

export function imageDimensionsTooSmallError(width, height) {
  if (width && height) {
    return getMessage(IMAGE_UPLOAD_DIMENSIONS_TOO_SMALL, { width, height });
  }
  if (width) {
    return getMessage(IMAGE_UPLOAD_WIDTH_TOO_SMALL, { width });
  }
  if (height) {
    return getMessage(IMAGE_UPLOAD_HEIGHT_TOO_SMALL, { height });
  }
  return null;
}

export function imageDimensionsTooBigError(width, height) {
  if (width && height) {
    return getMessage(IMAGE_UPLOAD_DIMENSIONS_TOO_BIG, { width, height });
  }
  if (width) {
    return getMessage(IMAGE_UPLOAD_WIDTH_TOO_BIG, { width });
  }
  if (height) {
    return getMessage(IMAGE_UPLOAD_HEIGHT_TOO_BIG, { height });
  }
  return null;
}

export function imageDimensionsInvalidError(width, height) {
  if (width && height) {
    return getMessage(IMAGE_UPLOAD_DIMENSIONS_INVALID, { width, height });
  }
  if (width) {
    return getMessage(IMAGE_UPLOAD_WIDTH_INVALID, { width });
  }
  if (height) {
    return getMessage(IMAGE_UPLOAD_HEIGHT_INVALID, { height });
  }
  return null;
}

export function imageSizeTooBigError(maxSize) {
  return getMessage(IMAGE_UPLOAD_SIZE_TOO_BIG, { maxSize });
}

export function imageUploadError() {
  return getMessage(IMAGE_UPLOAD_ERROR);
}

export function imageUploadInvalidType() {
  return getMessage(IMAGE_UPLOAD_INVALID_TYPE);
}

export function imagePreviewDeleteError() {
  return getMessage(IMAGE_PREVIEW_DELETE_ERROR);
}
