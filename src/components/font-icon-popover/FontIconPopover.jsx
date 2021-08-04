import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import classNames from 'classnames';
import './style.scss';

function renderPopover(message, className) {
  const classes = classNames('font-icon-popover__popover', className);
  return (
    <Popover id="font-icon-popover__popover" className={classes}>
      {message}
    </Popover>
  );
}

export default function FontIconPopover({
  className,
  children,
  message,
  placement,
  trigger,
  ...props
}) {
  return (
    <OverlayTrigger
      overlay={renderPopover(message, className)}
      placement={placement}
      trigger={trigger}
      {...props}
    >
      {React.Children.only(children)}
    </OverlayTrigger>
  );
}

FontIconPopover.propTypes = {
  /**
   * Additional class name to be passed to component
   */
  className: PropTypes.string,
  /**
   * FontIcon component that will have popover
   */
  children: PropTypes.node,
  /**
   * Message that will be displayed in popover
   */
  message: PropTypes.node,
  /**
   * Placement of popover in relation to icon
   */
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /**
   * Action/actions that trigger popover visibility
   */
  trigger: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

FontIconPopover.defaultProps = {
  placement: 'right',
  trigger: ['hover', 'focus'],
};
