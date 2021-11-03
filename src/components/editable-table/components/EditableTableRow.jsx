import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import EditableTableCell from './EditableTableCell';
import EditableTableActionsCell from './EditableTableActionsCell';

export default class EditableTableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      row: props.row,
      inEditMode: props.isEditMode,
    };

    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderTableCell = this.renderTableCell.bind(this);
  }

  handleEditClick() {
    const { row, onUpdateClick } = this.props;

    if (!_.isFunction(onUpdateClick)) {
      this.setState({ row, inEditMode: true });
      return;
    }

    const inEditMode = onUpdateClick(row);
    this.setState({ row, inEditMode });
  }

  handleSaveClick() {
    const { onSaveClick, index } = this.props;
    const { row } = this.state;

    onSaveClick(row, index);
    this.setState({ inEditMode: false });
  }

  handleDeleteClick() {
    const { onDeleteClick, index } = this.props;
    onDeleteClick(index);
  }

  handleRowClick() {
    const { onRowClick, row } = this.props;

    if (_.isFunction(onRowClick)) {
      onRowClick(row);
    }
  }

  handleInputChange(prop, value) {
    const { row } = this.state;

    this.setState({
      row: {
        ...row,
        [prop]: value,
      },
    });
  }

  isRowValid() {
    const { row } = this.state;
    const { requiredProps } = this.props;
    return _.every(requiredProps, prop => {
      const propValue = _.get(row, prop);
      return !_.isEmpty(propValue);
    });
  }

  renderTableCell(fieldDescriptor) {
    const { row, isStatic } = this.props;
    const { inEditMode, row: stateRow } = this.state;

    const { getDisplayValue, property } = fieldDescriptor;
    const currentRow = inEditMode ? stateRow : row;

    const value = _.isFunction(getDisplayValue)
      ? getDisplayValue(currentRow)
      : _.get(currentRow, property);

    return (
      <EditableTableCell
        key={property}
        propKey={property}
        inEditMode={inEditMode}
        value={value}
        onChange={this.handleInputChange}
        isStatic={isStatic}
      />
    );
  }

  render() {
    const { inEditMode } = this.state;
    const {
      row,
      rowDescriptors,
      canUpdate,
      canDelete,
      onRowClick,
    } = this.props;

    if (!inEditMode && !row) {
      return null;
    }

    const rowValid = this.isRowValid();

    const classes = classNames('editable-table-row', {
      'editable-table-row-cursor': _.isFunction(onRowClick),
    });

    return (
      <tr className={classes} onClick={this.handleRowClick}>
        {_.map(rowDescriptors, this.renderTableCell)}
        <EditableTableActionsCell
          onDeleteClick={this.handleDeleteClick}
          onSaveClick={this.handleSaveClick}
          onEditClick={this.handleEditClick}
          inEditMode={inEditMode}
          valid={rowValid}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </tr>
    );
  }
}

EditableTableRow.propTypes = {
  row: PropTypes.object,
  rowDescriptors: PropTypes.arrayOf(PropTypes.object).isRequired,
  requiredProps: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number,
  onRowClick: PropTypes.func,
  onSaveClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  isEditMode: PropTypes.bool,
  isStatic: PropTypes.bool,
  canUpdate: PropTypes.bool,
  canDelete: PropTypes.bool,
};

EditableTableRow.defaultProps = {
  isEditMode: false,
  requiredProps: [],
  row: {},
};
