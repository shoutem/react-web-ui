import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Modal, Button, HelpBlock } from 'react-bootstrap';
import classNames from 'classnames';
import Switch from '../switch';
import { LoaderContainer } from '../loader';
import './style.scss';

/**
 * Confirm modal allows generic modals for confirmation purposes.
 * It allows simple show by calling refs.show(options).
 */
export default class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      id: props.id,
      show: false,
      inProgress: false,
      error: null,
      confirmed: false,
    };
  }

  componentDidMount() {
    // Functions onConfirm and onAbort provided through props can unmount ConfirmModal component
    // (for instance, by navigating to another page). By default, after onConfirm or onAbort actions
    // are completed, component calls 'setState' to hide the Modal. This should be done only if
    // component is still mounted, so 'mounted' state is kept in this property.
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  show(options) {
    // if modal is already opened, do not open it again
    if (this.state.show) {
      return;
    }

    // merge options and props
    const finalOptions = {
      ...this.props,
      ...options,
    };

    this.setState({
      show: true,
      confirmed: false,
      ...finalOptions,
    });
  }

  hide() {
    if (this.mounted) {
      this.setState({
        inProgress: false,
        show: false,
      });
    }
  }

  handleConfirm() {
    const {
      onConfirm,
      onError,
      id,
      explicitConfirmationText,
      requireExplicitConfirmation,
      confirmed,
    } = this.state;

    if (!onConfirm) {
      this.hide();
      return;
    }

    this.setState({ inProgress: true });

    const shouldReturnConfirmationValue =
      !!explicitConfirmationText && !requireExplicitConfirmation;

    const onConfirmHandler = shouldReturnConfirmationValue
      ? onConfirm(id, confirmed)
      : onConfirm(id);

    Promise.resolve(onConfirmHandler).then(this.hide, error => {
      this.setState({ inProgress: false });
      if (onError) {
        const resolvedError = onError(error);
        this.setState({ error: resolvedError });
      }
    });
  }

  handleAbort() {
    const { onAbort, id } = this.state;

    if (!onAbort) {
      this.hide();
      return;
    }

    onAbort(id);
    this.hide();
  }

  handleToggleChanged() {
    const { confirmed } = this.state;

    this.setState({
      confirmed: !confirmed,
    });
  }

  render() {
    const { className } = this.props;
    const {
      show,
      title,
      message,
      hideConfirmBtn,
      confirmLabel,
      confirmBsStyle,
      explicitConfirmationText,
      requireExplicitConfirmation,
      hideAbortBtn,
      abortLabel,
      abortBsStyle,
      inProgress,
      error,
      confirmed,
    } = this.state;

    const classes = classNames('confirm-modal', className);
    const isDisabled =
      !!explicitConfirmationText && requireExplicitConfirmation && !confirmed;

    return (
      <Modal dialogClassName={classes} onHide={this.handleAbort} show={show}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="confirm-modal__message">{message}</div>
          {explicitConfirmationText && (
            <div className="confirm-modal__confirm">
              {explicitConfirmationText}
              <Switch checked={confirmed} onChange={this.handleToggleChanged} />
            </div>
          )}
          {error && (
            <HelpBlock className="confirm-modal__error-message text-error">
              {error}
            </HelpBlock>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!hideAbortBtn && (
            <Button bsStyle={abortBsStyle} onClick={this.handleAbort}>
              {abortLabel}
            </Button>
          )}
          {!hideConfirmBtn && (
            <Button
              bsStyle={confirmBsStyle}
              onClick={this.handleConfirm}
              disabled={isDisabled}
            >
              <LoaderContainer isLoading={inProgress}>
                {confirmLabel}
              </LoaderContainer>
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmModal.defaultProps = {
  hideConfirmBtn: false,
  confirmLabel: 'OK',
  confirmBsStyle: 'primary',
  hideAbortBtn: false,
  abortLabel: 'Cancel',
  abortBsStyle: 'default',
  onConfirm: null,
  onAbort: null,
  onError: null,
  inProgress: false,
  error: null,
};

ConfirmModal.propTypes = {
  /**
   * Id forwarded to onConfirm and onAbort actions.
   */
  id: PropTypes.string,
  /**
   * Add custom className to component
   */
  className: PropTypes.string,
  /**
   * Title of confirm modal content
   */
  title: PropTypes.string,
  /**
   * Content of modal, it can be simple string or component
   */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Flag for showing/hiding confirm button
   */
  hideConfirmBtn: PropTypes.bool,
  /**
   * Text inside confirm button
   */
  confirmLabel: PropTypes.string,
  /**
   * Bootstrap style of confirm button
   */
  confirmBsStyle: PropTypes.string,
  /**
   * Flag for showing/hiding abort button
   */
  hideAbortBtn: PropTypes.bool,
  /**
   * Text inside abort button
   */
  abortLabel: PropTypes.string,
  /**
   * Bootstrap style of abort button
   */
  abortBsStyle: PropTypes.string,
  /**
   * Callback function on confirm button click
   */
  onConfirm: PropTypes.func,
  /**
   * Callback function if error occurs after `onConfirm` action
   * If string is returned from this fn, it will be displayed in error block
   */
  onError: PropTypes.func,
  /**
   * Callback function on abort button click
   */
  onAbort: PropTypes.func,
  /**
   * Allow passing inProgress status from outside
   */
  inProgress: PropTypes.bool,
  /**
   * If explicitConfirmationText is passed, modal shows confirm text and confirm toggle
   * Confirm button is disabled until toggle is checked
   */
  explicitConfirmationText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  /**
   * If true, confirm button will be disabled until Switch is set to true.
   * If false, confirm button is enabled at all times, and ConfirmModal component will
   * return the value of Switch component, along of id.
   */
  requireExplicitConfirmation: PropTypes.bool,
};
