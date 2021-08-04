import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

export default function CircularLoader({ className, size }) {
  const classNameMap = classNames(
    className,
    'circular-loader'
  );

  const style = size && {
    width: size,
    height: size,
  };

  return (
    <div className={classNameMap} style={style} >
      <svg className="circular-loader__svg" viewBox="25 25 50 50">
        <circle className="circular-loader__circle-background" cx="50" cy="50" r="20" />
        <circle className="circular-loader__circle-path" cx="50" cy="50" r="20" />
      </svg>
    </div>
  );
}

CircularLoader.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
};
