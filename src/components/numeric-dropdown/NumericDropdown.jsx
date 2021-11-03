import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Dropdown, MenuItem } from 'react-bootstrap';

export default class NumericDropdown extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.createNumberOptions();
  }

  componentWillReceiveProps() {
    this.createNumberOptions();
  }

  createNumberOptions() {
    const { min, max } = this.props;
    this.setState({
      numberOptions: _.range(min, max + 1),
    });
  }

  render() {
    const { onChange, value } = this.props;
    const { numberOptions } = this.state;

    return (
      <Dropdown className="block" onSelect={onChange}>
        <Dropdown.Toggle>{value}</Dropdown.Toggle>
        <Dropdown.Menu>
          {_.map(numberOptions, key => (
            <MenuItem key={key} eventKey={key}>
              {key}
            </MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

NumericDropdown.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

NumericDropdown.defaultValues = {
  min: 1,
  max: 10,
};
