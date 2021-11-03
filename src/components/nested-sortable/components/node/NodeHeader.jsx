import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import FontIcon from '../../../font-icon';
import Dot from '../../../dot';
import NodeLevel from './NodeLevel';
import './style.scss';

export default class NodeHeader extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleClick() {
    const {
      item,
      onSelect,
      isSelected,
      canSelect,
      onToggleCollapse,
      isCollapsible,
    } = this.props;

    if (!canSelect) {
      return;
    }

    if (isCollapsible && isSelected(item.id)) {
      onToggleCollapse(item.id);
    }

    onSelect(item.id);
  }

  handleMouseEnter() {
    this.props.onHoverChange(this.props.item.id, true);
  }

  handleMouseLeave() {
    this.props.onHoverChange(this.props.item.id, false);
  }

  handleToggleCollapse(e) {
    this.props.onToggleCollapse(this.props.item.id);
    e.stopPropagation();
  }

  renderHandle() {
    const nodeHandleClasses = classNames('nested-sortable__node-handle', {
      'is-locked': !this.props.isDraggable,
    });

    return (
      <div>
        <FontIcon name="drag-handle" className={nodeHandleClasses} />
      </div>
    );
  }

  renderCaret() {
    const { canCollapse, isCollapsible, isCollapsed, item } = this.props;

    if (!canCollapse || !isCollapsible) {
      return null;
    }

    const caretType = isCollapsed(item.id) ? 'sortarrowdown' : 'sortarrowup';

    return (
      <FontIcon
        className="nested-sortable__node-caret"
        name={caretType}
        onClick={this.handleToggleCollapse}
      />
    );
  }

  renderUpdatesDot() {
    const { hasUpdates } = this.props;

    if (hasUpdates) {
      return <Dot className="nested-sortable__node-updates-dot" />;
    }

    return null;
  }

  render() {
    const {
      isDragging,
      isParentDragging,
      connectDragSource,
      isHorizontal,
      isHovered,
      isSelected,
      canSelect,
      item,
      level,
      step,
      offset,
      showDragHandle,
    } = this.props;

    const isDraggingGreedy = isDragging || isParentDragging;

    const nodeHeaderClasses = classNames('nested-sortable__node-header', {
      'is-selected': isSelected(item.id) && !isDraggingGreedy,
      'is-hover': isHovered(item.id) && !isDraggingGreedy,
      'is-select-disabled': !canSelect,
      'has-drag-handle': showDragHandle,
    });

    const nodePlaceholderClasses = classNames(
      'nested-sortable__node-placeholder',
      {
        'is-dragging': isDraggingGreedy,
        'is-horizontal': isHorizontal,
      },
    );

    return (
      <div
        className={nodeHeaderClasses}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {!isHorizontal && (
          <NodeLevel offset={offset} step={step} level={level} />
        )}
        {connectDragSource(this.renderHandle())}
        <div className={nodePlaceholderClasses}>
          {this.props.nodeHeaderTemplate(item)}
          {this.renderUpdatesDot()}
          {this.renderCaret()}
        </div>
      </div>
    );
  }
}

NodeHeader.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  isDraggable: PropTypes.bool,
  isDragging: PropTypes.bool,
  isParentDragging: PropTypes.bool,
  isSelected: PropTypes.func,
  onSelect: PropTypes.func,
  canSelect: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  isHovered: PropTypes.func,
  onHoverChange: PropTypes.func,
  onToggleCollapse: PropTypes.func,
  isCollapsible: PropTypes.bool,
  isCollapsed: PropTypes.func,
  canCollapse: PropTypes.bool,
  connectDragSource: PropTypes.func,
  nodeHeaderTemplate: PropTypes.func,
  step: PropTypes.number,
  offset: PropTypes.number,
  showDragHandle: PropTypes.bool,
  hasUpdates: PropTypes.bool,
};

NodeHeader.defaultProps = {
  canSelect: true,
  canCollapse: true,
  showDragHandle: false,
  hasUpdates: false,
};
