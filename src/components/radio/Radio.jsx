import React from 'react';
import PropTypes from 'prop-types';
import { Radio as ReactBootstrapRadio } from 'react-bootstrap';
import classNames from 'classnames';

export default function Radio(props) {
  const classes = classNames('se-radio', 'radio', props.className, {
    selected: props.checked,
  });

  return (
    <ReactBootstrapRadio bsClass={classes} {...props}>
      <span className="radio-icon"></span>
      {props.children}
    </ReactBootstrapRadio>
  );
}

Radio.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  children: PropTypes.node,
};
