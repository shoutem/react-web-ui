import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import FontIcon from '../../font-icon';

export default function EditableTableRowButton({
  onClick,
  disabled,
  iconName,
}) {
  return (
    <Button
      className="btn-icon pull-right"
      onClick={onClick}
      disabled={disabled}
    >
      <FontIcon name={iconName} size="24px" />
    </Button>
  );
}

EditableTableRowButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
};

EditableTableRowButton.defaultProps = {
  disabled: false,
};
