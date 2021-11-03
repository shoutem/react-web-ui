import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import _ from 'lodash';
import PropTypes from 'prop-types';
import FontIcon from '../font-icon';
import './style.scss';

export default class EmojiPicker extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      isPickerShown: false,
    };
  }

  handleToggleEmojiPicker() {
    const { isPickerShown } = this.state;

    this.setState({ isPickerShown: !isPickerShown }, () =>
      this.toggleEmojiPicker(),
    );
  }

  toggleEmojiPicker() {
    const { onToggleEmojiPicker } = this.props;

    if (_.isFunction(onToggleEmojiPicker)) {
      onToggleEmojiPicker();
    }
  }

  show() {
    this.setState({ isPickerShown: true });
  }

  hide() {
    this.setState({ isPickerShown: false });
  }

  render() {
    const { isPickerShown } = this.state;
    const { iconClassName, showTogglePickerButton, ...otherProps } = this.props;

    const iconClasses = classNames(iconClassName, {
      'emoji-picker__is-active': isPickerShown,
    });

    return (
      <div>
        {showTogglePickerButton && (
          <div>
            <FontIcon
              name="emoticon"
              size="24px"
              className={iconClasses}
              onClick={this.handleToggleEmojiPicker}
            />
          </div>
        )}
        <div>
          {isPickerShown && (
            <Picker title={''} emoji={''} emojiTooltip {...otherProps} />
          )}
        </div>
      </div>
    );
  }
}

EmojiPicker.propTypes = {
  onToggleEmojiPicker: PropTypes.func,
  onSelect: PropTypes.func,
  iconClassName: PropTypes.string,
  style: PropTypes.object,
  showTogglePickerButton: PropTypes.bool,
};

EmojiPicker.defaultProps = {
  showTogglePickerButton: true,
};
