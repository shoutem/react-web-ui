import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FontIcon from '../font-icon';
import './style.scss';

export default function FileUploadPlaceholder({
  className,
  uploadPlaceholderMessage,
}) {
  const classes = classnames('file-upload-placeholder', className);

  return (
    <div className={classes}>
      <div>
        <FontIcon name="add" />
        <div>{uploadPlaceholderMessage}</div>
      </div>
    </div>
  );
}

FileUploadPlaceholder.propTypes = {
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  uploadPlaceholderMessage: PropTypes.string,
};
