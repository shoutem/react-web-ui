import React from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { HelpBlock } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import FilePreview from '../file-preview';
import FileUploadPlaceholder from '../file-upload-placeholder';
import { LoaderContainer } from '../loader';
import './style.scss';

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
      error: null,
    };
  }

  handleUploadFailed(errorMessage) {
    const { onError } = this.props;

    this.setState({
      error: errorMessage,
      inProgress: false,
    });
    onError(errorMessage);
  }

  handleUploadSucceeded(fileUrl) {
    const { onUploadSuccess } = this.props;

    onUploadSuccess(fileUrl);
    this.setState({ inProgress: false });
  }

  validateFileSize(file) {
    const { localization, maxFileSize } = this.props;

    if (file.size > maxFileSize) {
      return localization.fileMaxSizeError;
    }
    return null;
  }

  uploadFile(file) {
    const {
      assetManager,
      folderName,
      localization,
      resolveFilename,
    } = this.props;

    const resolvedFilename = resolveFilename(file);
    const resolvedFolderPath = folderName ? `${folderName}/` : '';
    const resolvedPath = resolvedFolderPath + resolvedFilename;

    return new Promise((resolve, reject) => {
      return assetManager
        .uploadFile(resolvedPath, file)
        .then(path => resolve(path))
        .catch(() => reject(localization.fileUploadError));
    });
  }

  upload(file) {
    const { customValidator } = this.props;

    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(file);
      if (fileSizeError) {
        return reject(fileSizeError);
      }

      if (customValidator) {
        return Promise.resolve()
          .then(() => customValidator(file))
          .then(() => this.uploadFile(file))
          .then(resolvedPath => this.handleUploadSucceeded(resolvedPath))
          .catch(e => this.handleUploadFailed(e.message));
      }

      return this.uploadFile(file)
        .then(resolvedPath => this.handleUploadSucceeded(resolvedPath))
        .catch(e => this.handleUploadFailed(e.message));
    });
  }

  handleDrop(files) {
    const { onDrop } = this.props;

    const file = _.get(files, [0]);

    if (!file) {
      return;
    }

    this.setState({
      inProgress: true,
      error: null,
    });

    onDrop();

    this.upload(file)
      .then(this.handleUploadSucceeded)
      .catch(this.handleUploadFailed);
  }

  handleDropRejected() {
    const { localization } = this.props;

    this.setState({ error: localization.fileRejectedError });
  }

  handleDeleteFailed() {
    const { localization } = this.props;

    this.setState({
      error: localization.fileDeleteError,
      inProgress: false,
    });
  }

  handleDeleteClick(event) {
    event.stopPropagation();

    const { src, shallowDelete, onDeleteSuccess, assetManager } = this.props;

    if (shallowDelete) {
      return onDeleteSuccess(src);
    }

    this.setState({ inProgress: true });
    return assetManager.deleteFile(src).then(() => {
      this.setState({ inProgress: false });
      return onDeleteSuccess(src);
    }, this.handleDeleteFailed);
  }

  renderDropzoneContent() {
    const { src, canBeDeleted, localization } = this.props;

    if (!src) {
      return (
        <FileUploadPlaceholder
          uploadPlaceholderMessage={localization.fileUploadMessage}
        />
      );
    }

    return (
      <FilePreview
        src={src}
        canBeDeleted={canBeDeleted}
        onDeleteClick={this.handleDeleteClick}
      />
    );
  }

  render() {
    const { className, showValidationError, helpText, accept } = this.props;
    const { error, inProgress } = this.state;

    const classes = classNames(className, 'file-uploader');

    return (
      <LoaderContainer isLoading={inProgress} className={classes}>
        <Dropzone
          className="file-uploader__dropzone"
          onDrop={this.handleDrop}
          onDropRejected={this.handleDropRejected}
          multiple={false}
          accept={accept}
        >
          {dropzoneProps => this.renderDropzoneContent(dropzoneProps)}
        </Dropzone>
        {showValidationError && error && (
          <div className="text-error">{error}</div>
        )}
        {helpText && !error && <HelpBlock>{helpText}</HelpBlock>}
      </LoaderContainer>
    );
  }
}

FileUploader.propTypes = {
  /**
   *  Callback invoked when file is dropped and upload starts
   */
  onDrop: PropTypes.func.isRequired,
  /**
   *  Callback invoked when file is uploaded
   */
  onUploadSuccess: PropTypes.func.isRequired,
  /**
   *  Callback invoked when upload fails
   */
  onError: PropTypes.func,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Strings displayed to end users
   */
  localization: PropTypes.object,
  /**
   *  Url to the src
   */
  src: PropTypes.string,
  /**
   * Flag indicating whether to show validation error in component.
   * If set to false, onError function should be provided for displaying upload error.
   */
  showValidationError: PropTypes.bool,
  /**
   * Help text positioned below dropzone
   */
  helpText: PropTypes.string,
  /**
   * Object containing methods for inProgress, listing, and deleting files on cloud
   */
  assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
  }),
  folderName: PropTypes.string,
  resolveFilename: PropTypes.func,
  /**
   *  Callback forwarded to FilePreview component; invoked when existing file is deleted
   */
  onDeleteSuccess: PropTypes.func,
  /**
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   * By providing accept prop you can make Dropzone to accept
   * specific file types and reject the others.
   */
  accept: PropTypes.string,
  /**
   * Max file size allowed to be uploaded
   */
  maxFileSize: PropTypes.number,
  /**
   * Max file size allowed to be uploaded
   */
  shallowDelete: PropTypes.bool,
  /**
   * Provides a way to perform custom file validation before upload.
   * If you return a promise it will be resolved.
   */
  customValidator: PropTypes.func,
};

FileUploader.defaultProps = {
  maxFileSize: 10000000,
  onError: () => { },
  localization: {
    fileUploadError: 'File upload failed.',
    fileMaxSizeError: 'Max allowed file size is {{maxFileSize}}MB!',
    fileRejectedError: 'File rejected',
    fileDeleteError: 'Delete failed.',
    fileUploadMessage: 'Choose a file or drag it here.',
  },
  customValidator: _.noop,
  showValidationError: true,
  canBeDeleted: true,
  autoResize: true,
  resolveFilename: file => file.name,
};
