import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import './style.scss';

export default function EmptyResourcePlaceholder({
  imageSrc,
  imageSrcSet,
  imageSize,
  title,
  className,
  children,
}) {
  const classNameMap = classNames('empty-placeholder', className);
  const imageStyle = isObject(imageSize)
    ? imageSize
    : { width: imageSize, height: imageSize };

  return (
    <div className={classNameMap}>
      {imageSrc && (
        <img
          src={imageSrc}
          srcSet={imageSrcSet}
          role="presentation"
          style={imageStyle}
        />
      )}
      <h2>{title}</h2>
      <div className="empty-placeholder__content">{children}</div>
    </div>
  );
}

EmptyResourcePlaceholder.propTypes = {
  imageSrc: PropTypes.string,
  imageSrcSet: PropTypes.string,
  /**
   * If string, image will be rectangular, both width and height of `imageSize`.
   * If object, it must be have `width` and `height` properties.
   */
  imageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};
