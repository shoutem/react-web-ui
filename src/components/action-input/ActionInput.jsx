import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'react-bootstrap';
import DebounceInput from 'react-debounce-input';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import Left from './Left';
import Right from './Right';
import classNames from 'classnames';
import { SIDES } from './const';
import './style.scss';

class ActionInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftActionComponent: null,
      rightActionComponent: null,
    };

    this.actionInputControlRef = createRef();
    this.focus = this.focus.bind(this);
    this.getComponent = this.getComponent.bind(this);
    this.updateComponentsFromProps = this.updateComponentsFromProps.bind(this);
  }

  componentWillMount() {
    const { children } = this.props;
    this.updateComponentsFromProps(children);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.updateComponentsFromProps(nextProps.children);
    }
  }

  getComponent(children, key) {
    return _.find(
      React.Children.toArray(children),
      component => component.type.side === key,
    );
  }

  focus() {
    findDOMNode(this.actionInputControl.current).focus();
  }

  updateComponentsFromProps(children) {
    this.setState({
      leftActionComponent: this.getComponent(children, SIDES.LEFT),
      rightActionComponent: this.getComponent(children, SIDES.RIGHT),
    });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { className, debounceTimeout, children, ...otherProps } = this.props;

    const hasLeftComponent = !!this.state.leftActionComponent;
    const hasRightComponent = !!this.state.rightActionComponent;

    const classes = classNames('action-input', className, {
      'has-left-icon': hasLeftComponent,
      'has-right-icon': hasRightComponent,
    });

    return (
      <div className={classes}>
        <FormGroup>
          {hasLeftComponent && this.state.leftActionComponent}
          <DebounceInput
            ref={this.actionInputControlRef}
            className="action-input__form form-control"
            debounceTimeout={debounceTimeout}
            {...otherProps}
          />
          {hasRightComponent && this.state.rightActionComponent}
        </FormGroup>
      </div>
    );
  }
}

ActionInput.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  children: PropTypes.node,
  debounceTimeout: PropTypes.number,
};

ActionInput.defaultProps = {
  debounceTimeout: 500,
};

ActionInput.Left = Left;
ActionInput.Right = Right;

export default ActionInput;
