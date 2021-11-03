import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

export default function FontIcon({ className, name, size, ...props }) {
  const classNameMap = classNames(className, 'se-icon', `se-icon-${name}`);

  const style = {
    fontSize: size,
  };

  const otherProps = _.omit(props, ['bsStyle', 'bsRole']);

  return <span {...otherProps} style={style} className={classNameMap} />;
}

FontIcon.propTypes = {
  /**
   * Ny icon type se-icon-* (iconography)
   */
  name: PropTypes.string.isRequired,
  /**
   * Define size of icon
   */
  size: PropTypes.string,
  /**
   * Additional class name to be passed to react component
   */
  className: PropTypes.string,
};

FontIcon.defaultProps = {
  className: '',
  children: [],
};
