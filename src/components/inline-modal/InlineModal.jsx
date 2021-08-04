import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal, Button } from 'react-bootstrap';
import FontIcon from '../font-icon';
import './style.scss';

export default function InlineModal({ className, title, onHide, children, show }) {
  const classes = classNames('inline-modal', className);
  return (
    <Modal
      className={classes}
      show={show}
      backdrop={false}
    >
      <Modal.Header>
        <Button className="btn-icon pull-left" onClick={onHide}>
          <FontIcon name="back" size="24px" />
        </Button>
        {title && <h3 className="inline-modal__title pull-left">{title}</h3>}
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
}

InlineModal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onHide: PropTypes.func,
  children: PropTypes.node,
  show: PropTypes.bool,
};

InlineModal.defaultProps = {
  show: true,
};