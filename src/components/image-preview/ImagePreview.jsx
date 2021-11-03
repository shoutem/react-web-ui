import React from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import classnames from 'classnames';
import { imagePreviewDeleteError } from '../image-uploader';
import { LoaderContainer } from '../loader';
import FontIcon from '../font-icon';
import './style.scss';

export default class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  handleClick() {
    const { onClick, src } = this.props;
    if (_.isFunction(onClick)) {
      onClick(src);
    }
  }

  handleDeleteFailed() {
    const error = imagePreviewDeleteError();
    this.setState({ error, inProgress: false });
    this.props.onDeleteError(error);
  }

  handleDelete(event) {
    event.stopPropagation();
    this.setState({ inProgress: true });

    const { src, onDeleteSuccess, assetManager } = this.props;

    assetManager.deleteFile(src).then(() => {
      this.setState({ inProgress: false });
      onDeleteSuccess(src);
    }, this.handleDeleteFailed);
  }

  render() {
    const {
      src,
      className,
      onClick,
      width,
      height,
      icon,
      previewSize,
      canBeDeleted,
      deleteStyle,
      showDeleteError,
    } = this.props;

    const deletable = canBeDeleted && !!src;
    const classes = classnames(
      className,
      'image-preview',
      `image-preview-${previewSize}`,
      {
        'no-img': !src,
        [`image-preview__${deleteStyle}`]: deletable,
      },
    );

    const style = { width, height };
    if (!!src) {
      style.backgroundImage = `url('${src}')`;
    }
    if (_.isFunction(onClick)) {
      style.cursor = 'pointer';
    }

    const loaderClasses = classnames(
      'image-preview__loader',
      `image-preview__loader-${previewSize}`,
    );

    return (
      <LoaderContainer
        className={loaderClasses}
        isLoading={this.state.inProgress}
      >
        <div className={classes} style={style} onClick={this.handleClick}>
          {deletable && (
            <FontIcon onClick={this.handleDelete} name={deleteStyle} />
          )}
          {!src && <FontIcon name={icon} />}
        </div>
        {showDeleteError && this.state.error && (
          <div className="text-error">{this.state.error}</div>
        )}
      </LoaderContainer>
    );
  }
}

ImagePreview.propTypes = {
  /**
   * Valid url to the image
   */
  src: PropTypes.string.isRequired,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Click handler. If provided, cursor will be shown on hover
   */
  onClick: PropTypes.func,
  /**
   * Preview width
   */
  width: PropTypes.string,
  /**
   * Preview height
   */
  height: PropTypes.string,
  /**
   * FontIcon name (add-photo, add...)
   */
  icon: PropTypes.string,
  /**
   * Determines image preview block dimensions
   */
  previewSize: PropTypes.oneOf(['small', 'medium', 'large', 'custom']),
  /**
   * Flag indicating whether image can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   *  Callback invoked when image is deleted
   */
  onDeleteSuccess: PropTypes.func,
  /**
   * Defines UI style for hover effect when image can be deleted
   */
  deleteStyle: PropTypes.oneOf(['close', 'delete']),
  /**
   * Object containing methods for uploading, listing, and deleting files on cloud
   */
  assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
  }),
  /**
   *  Callback invoked when image deletion fails
   */
  onDeleteError: PropTypes.func,
  /**
   * Flag indicating whether to show deletion error in component.
   * If set to false, onDeleteError function should be provided for displaying deletion error.
   */
  showDeleteError: PropTypes.bool,
};

ImagePreview.defaultProps = {
  icon: 'add-photo',
  previewSize: 'small',
  deleteStyle: 'delete',
  showDeleteError: true,
  onDeleteError: _.noop,
};
