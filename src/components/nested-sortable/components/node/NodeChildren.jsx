import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NodeDraggable from '../node-draggable/index';
import './style.scss';

export default function NodeChildren(props) {
  const {
    isDragging,
    isParentDragging,
    level,
    item,
    isCollapsed,
  } = props;
  const { id, children } = item;
  const isDraggingGreedy = isDragging || isParentDragging;

  const nodeBodyClasses = classNames(
    'nested-sortable__node-children',
    {
      'is-collapsed': isCollapsed(item.id),
    }
  );

  return (
    <div className={nodeBodyClasses}>
      {children.map((child, i) => (
        <NodeDraggable
          {...props}
          key={child.id}
          item={child}
          index={i}
          level={level + 1}
          parentId={id}
          isParentDragging={isDraggingGreedy}
          isDraggable={child.isDraggable}
          isNestable={child.isNestable}
          doesParentAllowDrop={!item.disableDrop}
        />
        )
      )}
    </div>
  );
}

NodeChildren.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  isDragging: PropTypes.bool,
  isParentDragging: PropTypes.bool,
  isCollapsed: PropTypes.func,
};
