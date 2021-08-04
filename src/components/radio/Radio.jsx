import React from 'react';
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
