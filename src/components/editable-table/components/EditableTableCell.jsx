import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { FormGroup, FormControl } from 'react-bootstrap';

export default class EditableTableCell extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleChange(event) {
    const { onChange, propKey } = this.props;
    onChange(propKey, event.target.value);
  }

  renderFormGroup(disabled) {
    const { value } = this.props;
    return (
      <FormGroup>
        <input
          disabled={disabled}
          value={value || ''}
          className="form-control"
          type="text"
          onChange={this.handleChange}
        />
      </FormGroup>
    );
  }

  renderStaticFormControl() {
    const { value } = this.props;
    return <FormControl.Static>{value}</FormControl.Static>;
  }

  render() {
    const { inEditMode, isStatic } = this.props;
    const renderAsStatic = !inEditMode && isStatic;

    return (
      <td className="editable-table-cell">
        {renderAsStatic && this.renderStaticFormControl()}
        {!renderAsStatic && this.renderFormGroup(!inEditMode)}
      </td>
    );
  }
}

EditableTableCell.propTypes = {
  propKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inEditMode: PropTypes.bool,
  isStatic: PropTypes.bool,
};

EditableTableCell.defaultProps = {
  inEditMode: false,
};
