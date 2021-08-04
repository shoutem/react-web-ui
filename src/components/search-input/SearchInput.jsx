import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import ActionInput from '../action-input';

export default class SearchInput extends Component {
  constructor(props) {
    super(props);

    const { value, regexValue } = props;

    this.searchControlInputRef = createRef();
    this.focus = this.focus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputChanged = _.debounce(
      this.handleInputChanged.bind(this),
      250,
    );

    this.state = {
      value,
      regexValue,
    };
  }

  focus() {
    this.searchControlInputRef.current.focus();
  }

  handleInputChange(event) {
    const value = event.target.value;
    const regexValue = new RegExp(_.escapeRegExp(value), 'ig');

    this.setState(
      {
        value,
        regexValue,
      },
      this.handleInputChanged,
    );
  }

  handleInputChanged() {
    const { value, regexValue } = this.state;
    this.props.onChange({ value, regexValue });
  }

  render() {
    const { className } = this.props;
    const otherProps = _.omit(this.props, ['className', 'onChange']);
    const classes = classNames('search-input', className);

    return (
      <ActionInput
        type="search"
        className={classes}
        onChange={this.handleInputChange}
        ref={this.searchControlInputRef}
        {...otherProps}
      >
        <ActionInput.Left icon="search" onClick={_.noop} />
      </ActionInput>
    );
  }
}

SearchInput.propTypes = {
  /**
   * Additional class name to be passed to react component
   */
  className: PropTypes.string,
  /**
   * Function called when input is changed (with debounce of 250ms)
   */
  onChange: PropTypes.func,
  value: PropTypes.string,
  regexValue: PropTypes.string,
};

SearchInput.defaultProps = {
  value: null,
  regexValue: null,
};
