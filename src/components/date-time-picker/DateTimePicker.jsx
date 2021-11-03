import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import DateTime from 'react-datetime';
import classNames from 'classnames';
import dayjs from 'dayjs';
import DebounceInput from 'react-debounce-input';
import FontIcon from '../font-icon';
import './style.scss';

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { dateFormat, timeFormat } = props;

    const resolvedTimeFormat = !!timeFormat ? ` ${timeFormat}` : '';
    this.dateTimeFormat = `${dateFormat}${resolvedTimeFormat}`;
  }

  componentDidUpdate(prevProps) {
    const {
      dateFormat: prevDateFormat,
      timeFormat: prevTimeFormat,
    } = prevProps;
    const { dateFormat, timeFormat } = this.props;

    if (prevDateFormat !== dateFormat || prevTimeFormat !== timeFormat) {
      const resolvedTimeFormat = !!timeFormat ? ` ${timeFormat}` : '';
      this.dateTimeFormat = `${dateFormat}${resolvedTimeFormat}`;
    }
  }

  handleClearSelection() {
    this.props.onChange('');
  }

  renderInput(props) {
    const { clearable, value } = this.props;
    const renderClearButton = clearable && !_.isEmpty(value);

    return (
      <div className="date-time-picker__input">
        <DebounceInput
          className="form-control"
          debounceTimeout={1000}
          type="text"
          {...props}
        />
        {renderClearButton && (
          <FontIcon
            name="close"
            onClick={this.handleClearSelection}
            size="16px"
          />
        )}
      </div>
    );
  }

  render() {
    const { value, className, ...otherProps } = this.props;
    const classes = classNames('date-time-picker', className);

    if (!value) {
      return (
        <DateTime
          className={classes}
          renderInput={this.renderInput}
          {...this.props}
        />
      );
    }
    const dayjsValue = dayjs(value);
    if (!dayjsValue.isValid()) {
      // eslint-disable-next-line
      console.error(
        `Invalid value provided to DateTimePicker: ${JSON.stringify(value)}`,
      );
    }

    return (
      <DateTime
        className={classes}
        renderInput={this.renderInput}
        value={dayjsValue.format(this.dateTimeFormat)}
        {...otherProps}
      />
    );
  }
}

DateTimePicker.propTypes = {
  dateFormat: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
  timeFormat: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func,
  utc: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.object,
  clearable: PropTypes.bool,
};

DateTimePicker.defaultProps = {
  dateFormat: 'DD MMM YYYY',
  timeFormat: 'hh:mm a',
  utc: true,
  clearable: true,
};
