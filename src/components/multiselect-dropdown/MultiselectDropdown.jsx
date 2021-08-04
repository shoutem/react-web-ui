import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MenuItem } from 'react-bootstrap';
import Dropdown from '../dropdown';
import Checkbox from '../checkbox';
import { getDisplayLabel } from './services';
import './style.scss';

export default class MultiselectDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleItemSelected = this.handleItemSelected.bind(this);
    this.handleSelectionChanged = this.handleSelectionChanged.bind(this);
    this.handleSelectNone = this.handleSelectNone.bind(this);
    this.renderMenuItem = this.renderMenuItem.bind(this);
    this.renderSelectNoneOption = this.renderSelectNoneOption.bind(this);
    this.handleToggle = this.handleToggle.bind(this);

    const { selectedValues } = props;

    this.state = {
      selectedValues,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectedValues } = this.props;
    const { selectedValues: nextSelectedValues } = nextProps;

    if (selectedValues !== nextSelectedValues) {
      this.setState({ selectedValues: nextSelectedValues });
    }
  }

  handleItemSelected(event) {
    const { selectedValues } = this.state;
    const { target: { checked, value } } = event;

    const newSelectedValues = checked ?
      _.union(selectedValues, [value]) :
      _.without(selectedValues, value);

    this.setState({ selectedValues: newSelectedValues });
  }

  handleSelectNone() {
    this.setState({ selectedValues: [] });
  }

  handleSelectionChanged() {
    const { selectedValues } = this.state;
    const {
      onSelectionChanged,
      selectedValues: initialSelectedValues,
    } = this.props;

    if (_.isEqual(selectedValues, initialSelectedValues)) {
      return;
    }

    onSelectionChanged(selectedValues);
  }

  handleToggle(isOpen) {
    const { onToggle } = this.props;

    if (!isOpen) {
      this.handleSelectionChanged();
    }

    if (_.isFunction(onToggle)) {
      onToggle(isOpen);
    }
  }

  renderMenuItem(item) {
    const { selectedValues } = this.state;

    const { value, label } = item;
    const checked = _.includes(selectedValues, value);

    return (
      <Checkbox
        checked={checked}
        className="multiselect-dropdown__checkbox"
        key={value}
        onChange={this.handleItemSelected}
        value={value}
      >
        {label}
      </Checkbox>
    );
  }

  renderSelectNoneOption() {
    const { selectedValues } = this.state;
    const { selectNoneText } = this.props;

    const checked = _.isEmpty(selectedValues);

    return (
      <div>
        <Checkbox
          checked={checked}
          className="multiselect-dropdown__checkbox"
          onChange={this.handleSelectNone}
        >
          {selectNoneText}
        </Checkbox>
        <MenuItem divider />
      </div>
    );
  }

  render() {
    const { selectedValues } = this.state;
    const {
      options,
      displayLabelMaxSelectedOptions,
      emptyText,
      disabled,
      showSelectNoneOption,
    } = this.props;

    const dropdownDisabled = disabled || _.isEmpty(options);
    const selectedOptionLabel = getDisplayLabel(
      options,
      selectedValues,
      displayLabelMaxSelectedOptions,
      emptyText
    );

    return (
      <Dropdown
        className="multiselect-dropdown"
        disabled={dropdownDisabled}
        id="multiselect-dropdown"
        onToggle={this.handleToggle}
      >
        <Dropdown.Toggle>
          {selectedOptionLabel}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem>
            {selectedOptionLabel}
          </MenuItem>
          <MenuItem divider />
          {showSelectNoneOption && this.renderSelectNoneOption()}
          <div className="multiselect-dropdown__items">
            {_.map(options, this.renderMenuItem)}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

MultiselectDropdown.propTypes = {
  /**
   * Array of selected option values
   */
  selectedValues: PropTypes.array,
  /**
   * Available dropdown options. Each object must contain `value` and `label` props.
   */
  options: PropTypes.array,
  /**
   * Text that will be shown if no option is selected. Default: `None`.
   */
  emptyText: PropTypes.string,
  /**
   * Dropdown displays all selected options joined by comma (,).
   * As this label can be wider than dropdown's width, with following prop, it can be trimmed.
   * With this prop, you can control how many of selected options will be shown, and others
   * will be represented as `+ {n}` string.
   * For example, if 5 options are currently selected and displayLabelMaxSelectedOptions equals `2`,
   * label will be: `{selectedOption1}, {selectedOption2} + 3`.
   */
  displayLabelMaxSelectedOptions: PropTypes.number,
  /**
   * Optional function for sorting options
   */
  sortBy: PropTypes.func,
  /**
   * Callback function whenever dropdown is closed.
   * Called with array of selected values
   */
  onSelectionChanged: PropTypes.func,
  /**
   * Flag indicating whether dropdown is disabled
   */
  disabled: PropTypes.bool,
  /**
   * If true, `Select none` option will be rendered above other options and separated with divider.
   * When empty option is selected, all other options are disabled and onSelectionChanged
   * handler is called with empty array.
   */
  showSelectNoneOption: PropTypes.bool,
  /**
   * Label for `Select none` option
   */
  selectNoneText: PropTypes.string,
  onToggle: PropTypes.func,
};

MultiselectDropdown.defaultProps = {
  selectedValues: [],
  options: [],
  emptyText: 'None',
};
