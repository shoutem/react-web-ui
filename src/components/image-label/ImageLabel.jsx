import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

export default function ImageLabel({ src, right, className, size, ...props }) {
  const classes = classNames(
    className,
    'image-label'
  );
  const imgContainerClasses = classNames({
    'image-label__img-container': true,
    'is-left': !right,
    'is-right': right,
  });
  const boxSizeStyle = {
    width: size,
    height: size,
  };

  const ImgCmp = (
    <div style={boxSizeStyle} className={imgContainerClasses}>
      <img src={src} style={boxSizeStyle} className="image-label__image" />
    </div>
  );

  return (
    <div className={classes}>
      {!right && ImgCmp}
      <span className="image-label__label" {...props} />
      {right && ImgCmp}
    </div>
  );
}

ImageLabel.propTypes = {
  /**
   * Url of an image
   */
  src: PropTypes.string.isRequired,
  /**
   * Should icon be pulled right-most side
   */
  right: PropTypes.bool,
  /**
   * Additional class name to be passed to react component
   */
  className: PropTypes.string,
  /**
   * Define size of an image
   */
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
