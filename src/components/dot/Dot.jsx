import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

export default function Dot({ size, color, className }) {
  const classes = classNames('dot', className);

  const style = {};
  if (size) {
    style.width = size;
    style.height = size;
  }
  if (color) {
    style.backgroundColor = color;
  }

  return <div className={classes} style={style} />;
}

Dot.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
};
