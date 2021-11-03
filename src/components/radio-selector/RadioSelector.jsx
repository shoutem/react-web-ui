import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import { FormGroup } from 'react-bootstrap';
import Radio from '../radio';
import './style.scss';

export default class RadioSelector extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleSelect(event) {
    const { onSelect } = this.props;
    onSelect(event.target.value);
  }

  render() {
    const {
      className,
      options,
      activeValue,
      inline,
      groupName,
      radioOptionClassName,
    } = this.props;
    const classes = classNames('radio-selector', className);

    return (
      <FormGroup className={classes}>
        {options.map(option => (
          <Radio
            className={radioOptionClassName}
            inline={inline}
            key={option.value}
            checked={option.value === activeValue}
            name={groupName}
            value={option.value}
            onClick={this.handleSelect}
            disabled={option.disabled}
          >
            {option.label}
          </Radio>
        ))}
      </FormGroup>
    );
  }
}

RadioSelector.propTypes = {
  /**
   * List of options to display.
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Value will be returned as parameter of onSelect callback
       */
      value: PropTypes.any,
      /**
       * Label displayed on radio button
       */
      label: PropTypes.string,
      /**
       * Indicates whether radio button
       */
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  /**
   * Active value will select the option with same value
   */
  activeValue: PropTypes.any,
  className: PropTypes.string,
  radioOptionClassName: PropTypes.string,
  inline: PropTypes.bool,
  onSelect: PropTypes.func,
  /**
   * Name for the radio button group
   */
  groupName: PropTypes.string,
};

RadioSelector.defaultProps = {
  onSelect: _.noop,
  inline: false,
  groupName: 'radioGroup',
};
