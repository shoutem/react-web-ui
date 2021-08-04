import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActionInput from '../action-input';
import './style.scss';

export default class PasswordBox extends Component {
  constructor(props) {
    super(props);

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    this.state = { showPassword: false };
  }

  togglePasswordVisibility() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    const classes = classNames('password-box', {
      'show-password': this.state.showPassword,
    });
    const inputType = this.state.showPassword ? 'text' : 'password';
    const { disabled } = this.props;

    return (
      <div className={classes}>
        <ActionInput type={inputType} {...this.props}>
          <ActionInput.Right
            onClick={this.togglePasswordVisibility}
            icon="visibility-on"
            disabled={disabled}
          />
        </ActionInput>
      </div>
    );
  }
}

PasswordBox.propTypes = {
  disabled: PropTypes.bool,
};
