import React, { Component, createRef } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import DebounceInput from 'react-debounce-input';
import EmojiPicker from '../emoji-picker';
import './style.scss';

const EMOJI_PICKER_STYLE = {
  position: 'absolute',
  zIndex: 7,
  width: 558,
  marginLeft: -558,
  marginTop: 20,
}
export default class FormInput extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.inputRef = createRef();
  }

  componentWillUnmount() {
    this.inputRef = null;
  }

  handleEmojiSelect(emoji) {
    const { onChange } = this.props;

    if (_.isFunction(onChange) && !!emoji) {
      const input = _.get(this.inputRef, 'current');
      if (!input) {
        return;
      }

      const inputValue = _.toString(input.value);
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      const textBeforeSelectionStart = inputValue.substring(0, selectionStart);
      const textAfterSelectionEnd = inputValue.substring(
        selectionEnd,
        inputValue.length,
      );
  
      const value = `${textBeforeSelectionStart}${emoji.native}${textAfterSelectionEnd}`;
      // We're mocking event object so you don't have to check if it's object or value
      const event = { target: { value }}
      onChange(event);
  
      if (_.isFunction(input.focus)) {
        input.focus();
      }
    }
  }

  handleEmojiPickerToggled() {
    const input = _.get(this.inputRef, 'current');
      if (!input) {
        return;
      }

    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    if (_.isFunction(input.focus)) {
      input.focus();
    }
    if (_.isFunction(input.setSelectionRange)) {
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  render() {
    const {
      className,
      elementId,
      name,
      error,
      helpText,
      debounceTimeout,
      enableEmojiPicker,
      emojiIconClassName,
      emojiPickerStyle,
      ...otherProps
    } = this.props;

    const classes = classNames('form-input', className);
    const inputClasses = classNames('form-control', {
      'with-emoji-picker': enableEmojiPicker,
    });
    const emojiIconClasses = classNames('form-input_emoji-icon', emojiIconClassName);
    const helpBlockText = error || helpText;

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={error ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        <div className="form-input__container">
          <DebounceInput
            inputRef={this.inputRef}
            className={inputClasses}
            debounceTimeout={debounceTimeout}
            type="text"
            {...otherProps}
          />
          {enableEmojiPicker && (
            <EmojiPicker
              onSelect={this.handleEmojiSelect}
              onToggleEmojiPicker={this.handleEmojiPickerToggled}
              iconClassName={emojiIconClasses}
              style={{
                ...EMOJI_PICKER_STYLE,
                ...emojiPickerStyle,
              }}
            />
          )}
        </div>
        {!!helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}

FormInput.propTypes = {
  className: PropTypes.string,
  elementId: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  helpText: PropTypes.string,
  debounceTimeout: PropTypes.number,
  enableEmojiPicker: PropTypes.bool,
  emojiIconClassName: PropTypes.string,
  emojiPickerStyle: PropTypes.object,
};

FormInput.defaultProps = {
  debounceTimeout: 500,
  enableEmojiPicker: false,
};
