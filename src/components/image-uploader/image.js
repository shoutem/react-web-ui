import {
  imageDimensionsInvalidError,
  imageDimensionsTooSmallError,
  imageDimensionsTooBigError,
} from './errors';

function areImageDimensionsInvalid(image, width, height) {
  return (
    (width && image.width !== width) || (height && image.height !== height)
  );
}

function isImageTooSmall(image, minWidth, minHeight) {
  return image.width < minWidth || image.height < minHeight;
}

function isImageTooBig(image, maxWidth, maxHeight) {
  return image.width > maxWidth || image.height > maxHeight;
}

function validateWithAutoResize(image, options) {
  const { width, height, minWidth, minHeight } = options;

  if (minWidth && minHeight) {
    return isImageTooSmall(image, minWidth, minHeight)
      ? imageDimensionsTooSmallError(minWidth, minHeight)
      : null;
  }

  if (width && height) {
    return isImageTooSmall(image, width, height)
      ? imageDimensionsTooSmallError(width, height)
      : null;
  }

  return null;
}

function validateExactDimensions(image, options) {
  const { width, height, maxWidth, maxHeight, minWidth, minHeight } = options;

  if (areImageDimensionsInvalid(image, width, height)) {
    return imageDimensionsInvalidError(width, height);
  }

  if (isImageTooSmall(image, minWidth, minHeight)) {
    return imageDimensionsTooSmallError(minWidth, minHeight);
  }

  if (isImageTooBig(image, maxWidth, maxHeight)) {
    return imageDimensionsTooBigError(maxWidth, maxHeight);
  }

  return null;
}

export function validateImageDimensions(image, options) {
  const { autoResize } = options;

  if (autoResize) {
    return validateWithAutoResize(image, options);
  }

  return validateExactDimensions(image, options);
}

export function shouldResizeImage(image, options) {
  const { autoResize, width, height, maxWidth, maxHeight } = options;

  if (!autoResize) {
    return false;
  }

  if (width && height) {
    return areImageDimensionsInvalid(image, width, height);
  }

  if (maxHeight && maxWidth) {
    return isImageTooBig(image, maxWidth, maxHeight);
  }

  return false;
}

export function toFile(base64String, name, type) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new File([byteArray], name, { type });
}

/**
 * Resize provided image and return it as a Blob object
 * @param image - image to be resized
 * @param width - future image width
 * @param height - future image height
 * @param type - resized image type - supports common image types ('image/png', 'image/jpeg', ..)
 */
export function resizeImage(image, width, height, name, type = 'image/png') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  const base64Image = canvas.toDataURL(type);
  const formattedBase64Image = base64Image.split(',')[1];

  return toFile(formattedBase64Image, name, type);
}

/**
 * Calculates dimensions that image should have to satisfy given restraints.
 * Currently, only image downsizing is supported so dimensions are calculated only
 * if image is larger than allowed.
 * Both width and height or both maxWidth and maxHeight must be provided through options.
 *
 * If width and height are provided, those exact dimensions will be returned.
 * If maxWidth and maxHeight are provided, max possible dimensions will be calculated,
 * keeping image aspect ratio intact.
 *
 * @param image   - original image
 * @param options - must have either width & height or maxWidth & maxHeight
 * @returns object with width and height properties
 */
export function calculateValidImageDimensions(image, options) {
  const { width, height, maxWidth, maxHeight } = options;

  if (width && height) {
    return { width, height };
  }

  if (!(maxWidth && maxHeight)) {
    return null;
  }

  const { width: imageWidth, height: imageHeight } = image;
  if (imageWidth <= 0 || imageHeight <= 0) {
    return null;
  }

  if (imageWidth <= maxWidth && imageHeight <= maxHeight) {
    return {
      width: imageWidth,
      height: imageHeight,
    };
  }

  const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
  return {
    width: Math.floor(imageWidth * ratio),
    height: Math.floor(imageHeight * ratio),
  };
}
