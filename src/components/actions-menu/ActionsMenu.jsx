import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import FontIcon from '../font-icon';
import Dropdown from '../dropdown';
import './style.scss';

function stopEventPropagation(e) {
  e.stopPropagation();
}

/**
 * Wrapper component for all action menus, renders a three dots dropdown
 * Expects Dropdown.Menu as children
 * @param className
 * @param children
 * @constructor
 */
function ActionsMenu({ className, children }) {
  const classes = classNames('actions-menu', className);
  const menuId = _.uniqueId('actions-menu-');

  return (
    <Dropdown className={classes} id={menuId} onClick={stopEventPropagation}>
      <FontIcon bsRole="toggle" name="more" size="24px" />
      <Dropdown.Menu>{children}</Dropdown.Menu>
    </Dropdown>
  );
}

ActionsMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ActionsMenu;
