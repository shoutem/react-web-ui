import React from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import Uri from 'urijs';
import classnames from 'classnames';
import FontIcon from '../font-icon';
import './style.scss';

export default class FilePreview extends React.Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  render() {
    const {
      src,
      className,
      canBeDeleted,
      onDeleteClick,
      noFileErrorMessage,
    } = this.props;

    const filename = src ? new Uri(src).filename() : noFileErrorMessage;

    const classes = classnames(className, 'file-preview', {
      'is-deletable': canBeDeleted,
    });

    return (
      <div className={classes}>
        <div>
          <FontIcon name="file-uploaded" size="24px" />
          <div>{filename}</div>
        </div>
        {canBeDeleted && (
          <FontIcon
            name="delete"
            onClick={onDeleteClick}
            className="file-preview__delete"
          />
        )}
      </div>
    );
  }
}

FilePreview.propTypes = {
  /**
   * Valid url to the file
   */
  src: PropTypes.string.isRequired,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Click handler for delete icon
   */
  onDeleteClick: PropTypes.func,
  /**
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   * No file error message
   */
  noFileErrorMessage: PropTypes.string,
};
