import React from 'react';
import PropTypes from 'prop-types';

export default function TableRowTextPlaceholder({ colSpan, text }) {
  return (
    <tr className="table-row-text-placeholder">
      <td colSpan={colSpan}>{text}</td>
    </tr>
  );
}

TableRowTextPlaceholder.propTypes = {
  colSpan: PropTypes.number,
  text: PropTypes.string,
};

TableRowTextPlaceholder.defaultProps = {
  colSpan: 1,
};
