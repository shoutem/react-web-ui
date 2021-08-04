import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NodeHeader from './NodeHeader';
import NodeChildren from './NodeChildren';
import './style.scss';

export default class Node extends Component {
  renderNode() {
    const { isDragging, item, isHorizontal, hasUpdates } = this.props;
    const { canSelect, canCollapse, children } = item;

    const isCollapsible = children && children.length > 0;
    const nodeClasses = classNames('nested-sortable__node', {
      'is-dragging': isDragging,
      'is-horizontal': isHorizontal,
    });

    return (
      <div className={nodeClasses}>
        <NodeHeader
          {...this.props}
          canCollapse={canCollapse}
          canSelect={canSelect}
          isCollapsible={isCollapsible}
          isHorizontal={isHorizontal}
          hasUpdates={hasUpdates}
        />
        {item.children && <NodeChildren {...this.props} />}
      </div>
    );
  }

  render() {
    const { connectDragPreview, connectDropTarget } = this.props;
    return connectDragPreview(connectDropTarget(this.renderNode()));
  }
}

Node.propTypes = {
  item: PropTypes.object,
  isDragging: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  hasUpdates: PropTypes.bool,
  connectDragPreview: PropTypes.func,
  connectDropTarget: PropTypes.func,
};
