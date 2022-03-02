import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { HelpBlock } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { LoaderContainer } from '../loader';
import ImagePreview from '../image-preview';
import {
  imageSizeTooBigError,
  imageUploadError,
  imageUploadInvalidType,
} from './errors';
import {
  resizeImage as resizeImageService,
  calculateValidImageDimensions,
  validateImageDimensions,
  shouldResizeImage,
} from './image';
import './style.scss';

const ACCEPT_TYPES = {
  ANY: 'image/*',
  JPG: 'image/jpg',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
};

export default class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      uploading: false,
      error: null,
    };
  }

  handleUploadFailed(errorMessage) {
    this.setState({
      error: errorMessage,
      uploading: false,
    });
    this.props.onError(errorMessage);
  }

  handleUploadSucceeded(imageUrl) {
    const { id, onUploadSuccess } = this.props;
    this.setState({ uploading: false });

    if (_.isFunction(onUploadSuccess)) {
      onUploadSuccess(imageUrl, id);
    }
  }

  handleDeleteSucceeded(imageUrl) {
    const { id, onDeleteSuccess } = this.props;
    this.setState({ uploading: false });

    if (_.isFunction(onDeleteSuccess)) {
      onDeleteSuccess(imageUrl, id);
    }
  }

  handleDeleteFailed(errorMessage) {
    this.setState({ error: errorMessage });
  }

  validateDimensions(image) {
    const dimensionOptions = _.pick(this.props, [
      'autoResize',
      'width',
      'height',
      'maxWidth',
      'maxHeight',
      'minWidth',
      'minHeight',
    ]);

    return validateImageDimensions(image, dimensionOptions);
  }

  validateFileSize(file) {
    const { maxImageSize } = this.props;
    if (file.size > maxImageSize) {
      return imageSizeTooBigError(maxImageSize);
    }
    return null;
  }

  resizeImage(imageElement, imageFile) {
    const resizeOptions = _.pick(this.props, [
      'autoResize',
      'width',
      'height',
      'maxWidth',
      'maxHeight',
    ]);
    const shouldResize = shouldResizeImage(imageElement, resizeOptions);
    if (!shouldResize) {
      return imageFile;
    }

    const calculateOptions = _.pick(this.props, ['width', 'height']);
    const { width, height } = calculateValidImageDimensions(
      imageElement,
      calculateOptions,
    );
    const resizedImageFile = resizeImageService(
      imageElement,
      width,
      height,
      imageFile.name,
      imageFile.type,
    );

    return resizedImageFile;
  }

  upload(imageFile) {
    const { assetManager, folderName, resolveFilename } = this.props;
    const url = URL.createObjectURL(imageFile);
    const imageElement = new Image();

    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(imageFile);
      if (fileSizeError) {
        reject(fileSizeError);
        return;
      }

      imageElement.onload = () => {
        const imageDimensionsError = this.validateDimensions(imageElement);
        if (imageDimensionsError) {
          reject(imageDimensionsError);
          return;
        }

        const resizedImageFile = this.resizeImage(imageElement, imageFile);
        const resolvedFilename = resolveFilename(resizedImageFile);

        const resolvedFolderPath = folderName ? `${folderName}/` : '';
        const resolvedPath = resolvedFolderPath + resolvedFilename;

        assetManager
          .uploadFile(resolvedPath, resizedImageFile)
          .then(resolve, () => reject(imageUploadError()));
      };

      // this LOC serves to trigger imageElement.onload function (to validate and upload new image)
      imageElement.src = url;
    });
  }

  handleDrop(files) {
    const { acceptType, checkImageType } = this.props;
  
    if (files && files.length > 0) {
      this.setState({ uploading: true, error: null });
  
      const currentFile = files[0];
  
      if (checkImageType && currentFile.type !== acceptType) {
        return this.handleUploadFailed(imageUploadInvalidType());
      }
  
      this.upload(currentFile).then(
        this.handleUploadSucceeded,
        this.handleUploadFailed,
      );
    }
  }

  render() {
    const {
      className,
      icon,
      previewSize,
      preview,
      showValidationError,
      helpText,
      assetManager,
      canBeDeleted,
    } = this.props;

    const classes = classNames(
      className,
      'image-uploader__loader',
      `image-uploader__${previewSize}`,
    );

    return (
      <LoaderContainer isLoading={this.state.uploading} className={classes}>
        <Dropzone
          className="image-uploader__dropzone"
          onDrop={this.handleDrop}
          multiple={false}
          accept="image/*"
        >
          <ImagePreview
            src={preview}
            previewSize={previewSize}
            icon={icon}
            assetManager={assetManager}
            canBeDeleted={canBeDeleted}
            onDeleteSuccess={this.handleDeleteSucceeded}
            onDeleteError={this.handleDeleteFailed}
            showDeleteError={false}
          />
        </Dropzone>
        {showValidationError && this.state.error && (
          <div className="text-error">{this.state.error}</div>
        )}
        {helpText && !this.state.error && <HelpBlock>{helpText}</HelpBlock>}
      </LoaderContainer>
    );
  }
}

ImageUploader.propTypes = {
  /**
   * Object containing methods for uploading, listing, and deleting files on cloud
   */
   assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
  }).isRequired,
  /**
   * Path where to upload file
   */
  folderName: PropTypes.string.isRequired,
  /**
   *  Callback invoked when image is uploaded
   */
  onUploadSuccess: PropTypes.func.isRequired,
  /**
   * Accepted image type, used when checking image type
   */
  acceptType: PropTypes.string,
  /**
   * Flag indicating whether image should automatically be resized if it's not in correct dimensions
   */
  autoResize: PropTypes.bool,
  /**
   * Flag indicating whether image can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Flag indicating whether image type should be checked before uploading
   */
  checkImageType: PropTypes.bool,
  /**
   * Expected image height in pixels
   */
  height: PropTypes.number,
  /**
   * Help text positioned below dropzone
   */
  helpText: PropTypes.string,
  /**
   * FontIcon name (add-photo, add...)
   */
  icon: PropTypes.string,
  /**
   *  Id of the image
   */
  id: PropTypes.string,
  /**
   * Min allowed image height in pixels
   */
  minHeight: PropTypes.number,
  /**
   * Min allowed image width in pixels
   */
  minWidth: PropTypes.number,
  /**
   * Max allowed image size in bytes
   */
  maxImageSize: PropTypes.number,
  /**
   * Max allowed image height in pixels
   */
  maxHeight: PropTypes.number,
  /**
   * Max allowed image width in pixels
   */
  maxWidth: PropTypes.number,
  /**
   * Url to the preview image
   */
  preview: PropTypes.string,
  /**
   * Passed on as a prop to the ImagePreview component,
   * determines image preview block dimensions
   */
  previewSize: PropTypes.string,
  /**
   * Customize your file name before the upload
   */
  resolveFilename: PropTypes.func,
  /**
   * Flag indicating whether to show validation error in component.
   * If set to false, onError function should be provided for displaying upload error.
   */
  showValidationError: PropTypes.bool,
  /**
   * Expected image width in pixels
   */
  width: PropTypes.number,
  /**
   * Callback invoked when upload fails
   */
  onError: PropTypes.func,
  /**
   *  Callback forwarded to ImagePreview component; invoked when existing image is deleted
   */
  onDeleteSuccess: PropTypes.func,
};

ImageUploader.defaultProps = {
  acceptType: ACCEPT_TYPES.ANY,
  autoResize: true,
  canBeDeleted: true,
  checkImageType: false,
  icon: 'add',
  maxImageSize: 10000000,
  previewSize: 'small',
  resolveFilename: file => file.name,
  showValidationError: true,
  onError: () => {}, 
};
