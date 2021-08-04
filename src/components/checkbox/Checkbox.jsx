import React from 'react';
import { Checkbox as ReactBootstrapCheckbox } from 'react-bootstrap';
import './style.scss';

export default function Checkbox(props) {
  return (
    <ReactBootstrapCheckbox bsClass="se-checkbox checkbox" {...props}>
      <span className="checkbox-icon"></span>
      {props.children && <span className="checkbox-children">{props.children}</span>}
    </ReactBootstrapCheckbox>
  );
}
