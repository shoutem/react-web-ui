import { DropTarget } from 'react-dnd';
import {
  types,
  updateNodeLocation,
  detectSecondaryMovement,
  detectPrimaryMovement,
} from './dnd';

const nodeTarget = {
  drop(props, monitor) {
    if (monitor.didDrop()) {
      return undefined;
    }

    return {
      index: props.index,
      id: props.item.id,
      parentId: props.parentId,
      isCollapsed: props.isCollapsed(props.item.id),
      doesParentAllowDrop: props.doesParentAllowDrop,
      isNestable: props.isNestable,
    };
  },

  hover(props, monitor, component) {
    const node = monitor.getItem();
    const dragIndex = node.index;
    const dragId = node.id;
    const dragParentId = node.parentId;

    const hoverIndex = props.index;
    const hoverId = props.item.id;
    const hoverParentId = props.parentId;
    const doesParentAllowDrop = props.doesParentAllowDrop;

    // Don't look for every target container, only first, non-greedy
    const isOverCurrent = monitor.isOver({ shallow: true });
    if (!isOverCurrent) {
      return;
    }

    // Ignore if parent doesn't allow dropping of children
    if (!doesParentAllowDrop) {
      return;
    }

    // Don't allow interaction if dragged items is parent of hovered item
    if (dragId === hoverParentId) {
      return;
    }

    // Don't replace items with themselves, check only for horizontal change of node level
    if (dragId === hoverId) {
      const levelChange = detectSecondaryMovement(props, monitor, component);
      if (levelChange === 0) {
        return;
      }

      const destination = props.move(
        dragParentId,
        dragIndex,
        hoverParentId,
        hoverIndex,
        levelChange,
      );

      updateNodeLocation(node, destination);
      return;
    }

    const isVerticalMovement = detectPrimaryMovement(props, monitor, component);
    if (isVerticalMovement) {
      const destination = props.move(
        dragParentId,
        dragIndex,
        hoverParentId,
        hoverIndex,
      );
      updateNodeLocation(node, destination);
    }
  },
};

const connectTarget = connect => ({
  connectDropTarget: connect.dropTarget(),
});

export default function NodeDraggableTarget() {
  return new DropTarget(types.NODE, nodeTarget, connectTarget);
}
