import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import classNames from 'classnames';
import { ControlLabel } from 'react-bootstrap';
import { EditableTableRow, TableRowTextPlaceholder } from './components';
import './style.scss';

function extractRequiredProps(rowDescriptors) {
  const requiredDescriptors = _.filter(rowDescriptors, 'isRequired');
  return _.map(requiredDescriptors, 'property');
}

function resolveRowKeyGenerator(rowKeyIdentifier) {
  if (_.isFunction(rowKeyIdentifier)) {
    return rowKeyIdentifier;
  }

  if (_.isString(rowKeyIdentifier)) {
    return row => _.get(row, rowKeyIdentifier);
  }

  return _.noop;
}

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { rowDescriptors, rowKeyIdentifier } = props;
    const requiredProps = extractRequiredProps(rowDescriptors);
    const rowKeyGenerator = resolveRowKeyGenerator(rowKeyIdentifier);

    this.state = {
      requiredProps,
      rowKeyGenerator,
      addRowInProgress: false,
    };
  }

  addNewRow() {
    this.setState({ addRowInProgress: true });
  }

  closeNewRow() {
    this.setState({ addRowInProgress: false });
  }

  handleDeleteRow(index) {
    const { rows, onRowsUpdated, onRowDeleted, onRowDeleteClick } = this.props;

    const rowToDelete = rows[index];
    if (_.isFunction(onRowDeleteClick)) {
      const proceedWithDeletion = onRowDeleteClick(rowToDelete);
      if (!proceedWithDeletion) {
        return;
      }
    }

    const updatedRows = [
      ..._.slice(rows, 0, index),
      ..._.slice(rows, index + 1),
    ];

    onRowsUpdated(updatedRows);
    onRowDeleted(rowToDelete.id);
  }

  handleUpdateRow(updatedRow, index) {
    const { rows, onRowsUpdated, onRowUpdated } = this.props;

    const updatedRows = [
      ..._.slice(rows, 0, index),
      updatedRow,
      ..._.slice(rows, index + 1),
    ];

    onRowsUpdated(updatedRows);
    onRowUpdated(updatedRow.id, updatedRow);
  }

  handleAddRow(newRow) {
    const { rows, onRowsUpdated, onRowAdded } = this.props;
    const updatedRows = [newRow, ...rows];

    onRowsUpdated(updatedRows);
    onRowAdded(newRow);
    this.closeNewRow();
  }

  renderTableRow(row, index) {
    const {
      rowDescriptors,
      isStatic,
      canUpdate,
      canDelete,
      onRowClick,
      onRowUpdateClick,
    } = this.props;
    const { requiredProps, rowKeyGenerator } = this.state;

    const rowCanBeUpdated = row.canUpdate || canUpdate;
    const rowCanBeDeleted = row.canDelete || canDelete;

    return (
      <EditableTableRow
        key={rowKeyGenerator(row)}
        index={index}
        row={row}
        rowDescriptors={rowDescriptors}
        onRowClick={onRowClick}
        onSaveClick={this.handleUpdateRow}
        onDeleteClick={this.handleDeleteRow}
        onUpdateClick={onRowUpdateClick}
        requiredProps={requiredProps}
        isStatic={isStatic}
        canUpdate={rowCanBeUpdated}
        canDelete={rowCanBeDeleted}
      />
    );
  }

  renderTableRows(displayEmptyState) {
    const { rows, headers, emptyStateText } = this.props;
    const emptyRows = _.isEmpty(rows);
    if (emptyRows && displayEmptyState) {
      return (
        <TableRowTextPlaceholder
          text={emptyStateText}
          colSpan={_.size(headers)}
        />
      );
    }

    return _.map(rows, (row, index) => this.renderTableRow(row, index));
  }

  render() {
    const { className, headers, rowDescriptors } = this.props;

    const { addRowInProgress, requiredProps } = this.state;

    const classes = classNames('editable-table', className);

    return (
      <div className={classes}>
        <table className="table editable-table__table">
          <thead>
            <tr>
              {_.map(headers, (header, index) => (
                <th key={index}>
                  <ControlLabel>{header}</ControlLabel>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {addRowInProgress && (
              <EditableTableRow
                isEditMode
                rowDescriptors={rowDescriptors}
                onSaveClick={this.handleAddRow}
                onDeleteClick={this.closeNewRow}
                requiredProps={requiredProps}
                isStatic={false}
                canUpdate
                canDelete
              />
            )}
            {this.renderTableRows(!addRowInProgress)}
          </tbody>
        </table>
      </div>
    );
  }
}

EditableTable.propTypes = {
  /**
   * Array of string values to be used as column headers
   */
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Array of descriptors for each cell values.
   * Each descriptor can contain 3 fields:
   *  - `isRequired`: marks value as required, used for inline row editing,
   *                  save btn disabled until value is populated
   *  - `property`: defines property key for extracting cell value from row
   *  - `getDisplayValue`: function that can be used instead of providing `property`.
   *                       input: row, output: display string for current table cell.
   */
  rowDescriptors: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Array of table rows
   */
  rows: PropTypes.array.isRequired,
  /**
   * Additional class name to be passed to react component
   */
  className: PropTypes.string,
  /**
   * Text to be displayed if table has no rows
   */
  emptyStateText: PropTypes.string,
  /**
   * Serves for providing unique key to each table row.
   * If string, key will be row property with that name.
   * If function, expected signature is (row:Object): String.
   */
  rowKeyIdentifier: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  /**
   * Function called on every table change.
   * Input param: complete array of rows
   */
  onRowsUpdated: PropTypes.func.isRequired,
  /**
   * Function called when row is added to table.
   * Input param: newly added row
   */
  onRowAdded: PropTypes.func,
  /**
   * Function called when row is deleted from table.
   * Input param: deleted row's id.
   */
  onRowDeleted: PropTypes.func,
  /**
   * Function called when row is updated.
   * Input params: updated row's id, updated row
   */
  onRowUpdated: PropTypes.func,
  /**
   * Function called when row is clicked.
   * Output: clicked row.
   */
  onRowClick: PropTypes.func,
  /**
   * Function called when update button is clicked for specific row.
   * Input params: row
   * Output: bool flag indicating whether selected row should enter edit mode or remain static.
   */
  onRowUpdateClick: PropTypes.func,
  /**
   * Function called when delete button is clicked for specific row.
   * This function overrides default table behaviour (removing selected row from array `rows`,
   * then calling `onRowsUpdated` and `onRowDeleted` prop functions).
   * Input params: row
   */
  onRowDeleteClick: PropTypes.func,
  /**
   * Flag indicating whether rows that are not in
   * edit mode should be displayed as disabled form control
   * or just simple text
   */
  isStatic: PropTypes.bool,
  /**
   * Flag indicating whether any row can be updated
   */
  canUpdate: PropTypes.bool,
  /**
   * Flag indicating whether any row can be deleted
   */
  canDelete: PropTypes.bool,
};

EditableTable.defaultProps = {
  rows: [],
  rowKeyIdentifier: 'id',
  onRowsUpdated: _.noop,
  onRowAdded: _.noop,
  onRowUpdated: _.noop,
  onRowDeleted: _.noop,
  onRowUpdateClick: null,
  onRowDeleteClick: null,
  emptyStateText: 'No items yet.',
  isStatic: false,
  canUpdate: true,
  canDelete: true,
};
