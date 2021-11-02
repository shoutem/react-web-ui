import React, { Component, createRef } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import get from 'lodash/get';
import omit from 'lodash/omit';
import toString from 'lodash/toString';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import { ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import DebounceInput from 'react-debounce-input';
import EmojiPicker from '../emoji-picker';
import './style.scss';

const EMOJI_PICKER_STYLE = {
  position: 'absolute',
  zIndex: 7,
  width: 528,
  marginLeft: -528,
  marginTop: 10,
};

function fieldInError(formField) {
  return formField.touched && formField.error;
}

export default class ReduxFormElement extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.inputRef = createRef();

    this.state = {
      selectionStart: null,
    };
  }

  componentWillUnmount() {
    this.inputRef = null;
  }

  getDebouncedInput() {
    const {
      debounceTimeout,
      disabled,
      field,
      enableEmojiPicker,
      emojiPickerStyle,
      emojiIconClassName,
      className,
      ...otherProps
    } = this.props;

    const inputClasses = classNames('form-control', className, {
      'with-emoji-picker': enableEmojiPicker,
    });
    const emojiIconClasses = classNames(
      'redux-form-element__emoji-icon',
      emojiIconClassName,
    );
    const inputProps = omit({ disabled, ...field, ...otherProps }, 'className');

    return (
      <div className="redux-form-element__container">
        <DebounceInput
          {...inputProps}
          inputRef={this.inputRef}
          className={inputClasses}
          debounceTimeout={debounceTimeout}
          type="text"
        />
        {enableEmojiPicker && (
          <EmojiPicker
            onSelect={this.handleEmojiSelect}
            onToggleEmojiPicker={this.handleEmojiPickerShown}
            iconClassName={emojiIconClasses}
            style={{
              ...EMOJI_PICKER_STYLE,
              ...emojiPickerStyle,
            }}
          />
        )}
      </div>
    );
  }

  handleEmojiPickerShown() {
    const input = get(this.inputRef, 'current');
    if (!input) {
      return;
    }

    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    if (isFunction(input.focus)) {
      input.focus();
    }
    if (isFunction(input.setSelectionRange)) {
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  handleEmojiSelect(emoji) {
    const input = get(this.inputRef, 'current');
    if (!input || !emoji) {
      return;
    }

    const inputValue = toString(input.value);
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const textBeforeSelectionStart = inputValue.substring(0, selectionStart);
    const textAfterSelectionEnd = inputValue.substring(
      selectionEnd,
      inputValue.length,
    );
    const value = `${textBeforeSelectionStart}${emoji.native}${textAfterSelectionEnd}`;

    const onChange = get(this.props, 'field.onChange');
    if (isFunction(onChange)) {
      onChange(value);
    }
    if (isFunction(input.focus)) {
      input.focus();
    }
  }

  render() {
    const {
      className,
      elementId,
      name,
      field,
      disabled,
      children,
      helpText,
      ...otherProps
    } = this.props;

    const isError = fieldInError(field);
    const classes = classNames('redux-form-element', className);
    const helpBlockText = isError ? field.error : helpText;

    const child = children || this.getDebouncedInput();
    const childProps = {
      disabled,
      ...field,
      ...otherProps,
    };

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        {!children && React.cloneElement(React.Children.only(child))}
        {children && React.cloneElement(React.Children.only(child), childProps)}
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}

ReduxFormElement.propTypes = {
  className: PropTypes.string,
  elementId: PropTypes.string,
  name: PropTypes.string,
  field: PropTypes.object,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  helpText: PropTypes.string,
  onChange: PropTypes.func,
  debounceTimeout: PropTypes.number,
  enableEmojiPicker: PropTypes.bool,
  emojiPickerStyle: PropTypes.object,
  emojiIconClassName: PropTypes.string,
};

ReduxFormElement.defaultProps = {
  debounceTimeout: 500,
  enableEmojiPicker: false,
};
