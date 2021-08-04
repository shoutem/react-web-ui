import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as ReactBootstrapCheckbox } from 'react-bootstrap';
import './style.scss';

export default function Checkbox(props) {
  return (
    <ReactBootstrapCheckbox bsClass="se-checkbox checkbox" {...props}>
      <span className="checkbox-icon" />
      {props.children && (
        <span className="checkbox-children">{props.children}</span>
      )}
    </ReactBootstrapCheckbox>
  );
}

Checkbox.propTypes = {
  children: PropTypes.node,
};
