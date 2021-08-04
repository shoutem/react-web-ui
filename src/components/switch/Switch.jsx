import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import './style.scss';

export default class Switch extends Component {
  constructor(props) {
    super(props);

    this.handleToggleSwitch = this.handleToggleSwitch.bind(this);
    this.renderSwitchButton = this.renderSwitchButton.bind(this);

    this.state = {
      switchId: _.uniqueId('switch__'),
      checked: !!props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value: nextValue } = nextProps;
    const { value } = this.props;

    if (nextValue !== value) {
      this.setState({ checked: !!nextValue });
    }
  }

  handleToggleSwitch(e) {
    const { checked } = this.state;
    const { onChange } = this.props;

    this.setState({ checked: !checked });
    onChange(e);
  }

  renderSwitchButton() {
    const otherProps = _.omit(this.props, ['className', 'children']);
    const { checked, switchId } = this.state;

    return (
      <div className="switch__button">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={this.handleToggleSwitch}
          {...otherProps}
        />
        <label htmlFor={switchId} />
        <div className="switch__knob" />
        <div className="switch__knob-background" />
      </div>
    );
  }

  render() {
    const { className, children } = this.props;
    const classNameMap = classNames('switch', className);

    return (
      <div className={classNameMap}>
        {children}
        {this.renderSwitchButton()}
      </div>
    );
  }
}

Switch.propTypes = {
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node,
};
