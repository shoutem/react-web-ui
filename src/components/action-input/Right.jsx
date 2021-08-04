import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import FontIcon from '../font-icon';
import { SIDES } from './const';

export default function Right(props) {
  const { onClick, icon, disabled } = props;
  return (
    <Button
      onClick={onClick}
      className="btn-icon action-input__right-button"
      disabled={disabled}
    >
      <FontIcon name={icon} size="24px" />
    </Button>
  );
}

Right.side = SIDES.RIGHT;

Right.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
