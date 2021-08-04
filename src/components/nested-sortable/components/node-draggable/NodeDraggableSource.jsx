import { DragSource } from 'react-dnd';
import {
  types,
  returnNodeToSource,
} from './dnd';

const nodeSource = {
  canDrag(props) {
    return props.isDraggable;
  },

  beginDrag(props) {
    const source = {
      index: props.index,
      id: props.item.id,
      parentId: props.parentId,
      beginDragIndex: props.index,
      beginDragId: props.item.id,
      beginDragParentId: props.parentId,
    };

    props.onDragAndDropStart(source);

    return source;
  },

  endDrag(props, monitor) {
    const node = monitor.getItem();
    const dropResult = monitor.getDropResult();

    const source = {
      index: node.beginDragIndex,
      id: node.beginDragId,
      parentId: node.beginDragParentId,
    };

    const target = {
      index: node.index,
      id: node.id,
      parentId: node.parentId,
    };

    // Return dragged node to original place if drop is not available/accessible
    if (!dropResult || !dropResult.doesParentAllowDrop) {
      returnNodeToSource(props, node, source, target);
      return;
    }

    props.onDragAndDropComplete(source, target);
  },

  isDragging(props, monitor) {
    return props.item.id === monitor.getItem().id;
  },
};

const connectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
});

export default function NodeDraggableSource() {
  return new DragSource(types.NODE, nodeSource, connectSource);
}
