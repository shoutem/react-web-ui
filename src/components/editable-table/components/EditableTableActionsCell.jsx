import React from 'react';
import PropTypes from 'prop-types';
import EditableTableRowButton from './EditableTableRowButton';

export default function EditableTableActionsCell({
  inEditMode,
  onDeleteClick,
  canUpdate,
  canDelete,
  onEditClick,
  onSaveClick,
  valid,
}) {
  if (!canUpdate && !canDelete) {
    return null;
  }

  const showEditButton = canUpdate && !inEditMode;
  const showSaveButton = canUpdate && inEditMode;

  return (
    <td className="editable-table-actions-cell">
      {canDelete &&
        <EditableTableRowButton
          onClick={onDeleteClick}
          iconName="delete"
        />
      }
      {showEditButton &&
        <EditableTableRowButton
          onClick={onEditClick}
          iconName="edit"
        />
      }
      {showSaveButton &&
        <EditableTableRowButton
          onClick={onSaveClick}
          iconName="check"
          disabled={!valid}
        />
      }
    </td>
  );
}

EditableTableActionsCell.propTypes = {
  valid: PropTypes.bool,
  inEditMode: PropTypes.bool,
  onDeleteClick: PropTypes.func,
  onSaveClick: PropTypes.func,
  onEditClick: PropTypes.func,
  canUpdate: PropTypes.bool,
  canDelete: PropTypes.bool,
};

EditableTableActionsCell.defaultProps = {
  valid: true,
};
