import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Modal, Button } from 'react-bootstrap';

export default function InfoModal({
  title,
  message,
  btnLabel,
  btnBsStyle,
  onHide,
}) {
  return (
    <Modal show onHide={onHide} dialogClassName="info-modal">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle={btnBsStyle} onClick={onHide}>
          {btnLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

InfoModal.defaultProps = {
  btnLabel: 'Close',
  btnBsStyle: 'primary',
  onHide: noop,
};

InfoModal.propTypes = {
  /**
   * Title of the info modal content
   */
  title: PropTypes.string,
  /**
   * Content of modal, it can be simple string or component
   */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Display label for button
   */
  btnLabel: PropTypes.string,
  /**
   * Bootstrap style for button
   */
  btnBsStyle: PropTypes.string,
  /**
   * Callback function on `close` button click
   */
  onHide: PropTypes.func,
};
