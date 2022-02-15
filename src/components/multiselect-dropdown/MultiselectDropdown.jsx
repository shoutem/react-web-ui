import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { MenuItem } from 'react-bootstrap';
import Dropdown from '../dropdown';
import Checkbox from '../checkbox';
import { getDisplayLabel } from './services';
import './style.scss';

export default class MultiselectDropdown extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

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
    const {
      target: { checked, value },
    } = event;

    const newSelectedValues = checked
      ? _.union(selectedValues, [value])
      : _.without(selectedValues, value);

    this.setState({ selectedValues: newSelectedValues });
  }

  handleSelectNone() {
    this.setState({ selectedValues: [] });
  }

  handleSelectAll() {
    const { options } = this.props;
    const selectedValues = _.map(options, 'value');

    this.setState({ selectedValues });
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

  render() {
    const { selectedValues } = this.state;
    const {
      options,
      displayLabelMaxSelectedOptions,
      emptyText,
      disabled,
      showSelectNoneOption,
      showSelectAllOption,
      selectNoneText,
      selectAllText,
      selectText,
    } = this.props;

    const dropdownDisabled = disabled || _.isEmpty(options);
    const selectedOptionLabel = getDisplayLabel(
      options,
      selectedValues,
      displayLabelMaxSelectedOptions,
      emptyText,
    );

    const hasSelectOptions = showSelectAllOption || showSelectNoneOption;

    return (
      <Dropdown
        className="multiselect-dropdown"
        disabled={dropdownDisabled}
        id="multiselect-dropdown"
        onToggle={this.handleToggle}
      >
        <Dropdown.Toggle>{selectedOptionLabel}</Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem>{selectedOptionLabel}</MenuItem>
          <MenuItem divider />
          {hasSelectOptions && (
            <>
              <div className="select-options">
                <div>{selectText}</div>
                {showSelectAllOption && (
                  <div className="select-option" onClick={this.handleSelectAll}>
                    {selectAllText}
                  </div>
                )}
                {showSelectAllOption && showSelectNoneOption && <span>,</span>}
                {showSelectNoneOption && (
                  <div
                    className="select-option"
                    onClick={this.handleSelectNone}
                  >
                    {selectNoneText}
                  </div>
                )}
              </div>
              <MenuItem divider />
            </>
          )}
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
  showSelectNoneOption: PropTypes.bool,
  showSelectAllOption: PropTypes.bool,
  selectText: PropTypes.string,
  selectNoneText: PropTypes.string,
  selectAllText: PropTypes.string,
  onToggle: PropTypes.func,
};

MultiselectDropdown.defaultProps = {
  selectedValues: [],
  options: [],
  selectText: 'Select',
  emptyText: 'None',
};
