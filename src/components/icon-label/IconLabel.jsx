import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontIcon from './../font-icon/FontIcon';
import './style.scss';

export default function IconLabel({
  iconName,
  right,
  className,
  size,
  ...props
}) {
  const classes = classNames(className, 'icon-label');
  const fontIconClasses = classNames({
    'icon-label__icon': true,
    'is-left': !right,
    'is-right': right,
  });
  const FontIconCmp = (
    <FontIcon name={iconName} size={size} className={fontIconClasses} />
  );

  return (
    <div className={classes}>
      {!right && FontIconCmp}
      <span className="text-ellipsis icon-label__label" {...props} />
      {right && FontIconCmp}
    </div>
  );
}

IconLabel.propTypes = {
  /**
   * Name of the icon from FontIcon font
   */
  iconName: PropTypes.string.isRequired,
  /**
   * Should icon be pulled right-most side
   */
  right: PropTypes.bool,
  /**
   * Additional class name to be passed to react component
   */
  className: PropTypes.string,
  /**
   * Define size of icon
   */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

IconLabel.defaultProps = {
  right: false,
  className: '',
};
