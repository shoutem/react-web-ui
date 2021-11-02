import { findDOMNode } from 'react-dom';
import isEqual from 'lodash/isEqual';

function getHoverCenter(hoverBoundingRect, isHorizontal) {
  return isHorizontal
    ? (hoverBoundingRect.right - hoverBoundingRect.left) / 2
    : (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
}

function getOffset(clientOffset, hoverBoundingRect, isHorizontal) {
  return isHorizontal
    ? (clientOffset.x = hoverBoundingRect.left)
    : clientOffset.y - hoverBoundingRect.top;
}

export const types = {
  NODE: '@@nested-sortable\node',
};

export function updateNodeLocation(node, destination) {
  if (node && destination) {
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    /* eslint-disable no-param-reassign */
    node.index = destination.index;
    node.parentId = destination.parentId;
    /* eslint-enable no-param-reassign */
  }
}

export function returnNodeToSource(props, node, source, target) {
  if (isEqual(source, target)) {
    return;
  }

  // need to do reverse move to ensure everything is consistent
  const destination = props.move(
    target.parentId,
    target.index,
    source.parentId,
    source.index,
  );

  updateNodeLocation(node, destination);
}

/**
 * Calculates need for level change, based on the movement of source relative to target rectangle.
 * Takes UI offsets and level steps into account.
 * @returns {number} - level change, negative for moving toward root of tree, positive towards leafs
 */
export function detectSecondaryMovement(props, monitor, component) {
  const { offset, step, level, isHorizontal } = props;

  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
  const sourceClientOffset = monitor.getSourceClientOffset();
  const axisOffset = getOffset(
    sourceClientOffset,
    hoverBoundingRect,
    isHorizontal,
  );

  const leftHorizontalLevelRange = offset + step * (level - 1);
  const rightHorizontalLevelRange = offset + step * (level + 1);

  if (axisOffset < leftHorizontalLevelRange) {
    return -1;
  }

  if (axisOffset < rightHorizontalLevelRange) {
    return 1;
  }

  return 0;
}

/**
 * Checks if vertical movement (in vertical mode) or horizontal movement (in horizontal mode)
 * satisfies making move based on change in relevant axis offset (y for vertical, x for horizontal)
 * that must exceed 50% of element height/width.
 * Also checks for additional constraints and conditions
 * @returns {boolean} has or hasn't vertical movement between source and target
 */
export function detectPrimaryMovement(props, monitor, component) {
  const { index, item, parentId, isHorizontal } = props;

  const node = monitor.getItem();
  const dragIndex = node.index;
  const dragParentId = node.parentId;

  const hoverIndex = index;
  const hoverId = item.id;
  const hoverParentId = parentId;

  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

  // Get vertical or horizontal middle (depending on `isHorizontal` prop)
  const hoverCenter = getHoverCenter(hoverBoundingRect, isHorizontal);

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the top (if vertical) or right (if horizontal)
  const pixelsMoved = getOffset(clientOffset, hoverBoundingRect, isHorizontal);

  // Only apply control if dragNode and hoverNode are on the same level
  if (dragParentId === hoverParentId) {
    // Only perform the move when the mouse has crossed half of the items height (if vertical)
    // or width (if horizontal)
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards, but not over 50%
    if (dragIndex < hoverIndex && pixelsMoved < hoverCenter) {
      return false;
    }

    // Dragging upwards, but not over 50%
    if (dragIndex > hoverIndex && pixelsMoved > hoverCenter) {
      return false;
    }
  }

  // Case when drag parent is hover node - children item over parent
  if (dragParentId === hoverId) {
    // Dragging upwards over parent, only if above half
    if (pixelsMoved > hoverCenter) {
      return false;
    }
  }

  return true;
}
