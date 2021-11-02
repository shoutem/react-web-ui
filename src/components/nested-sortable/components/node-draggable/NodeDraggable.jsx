import flow from 'lodash/flow';
import NodeDraggableTarget from './NodeDraggableTarget';
import NodeDraggableSource from './NodeDraggableSource';
import Node from '../node/index';

const NodeDraggable = flow(
  new NodeDraggableTarget(),
  new NodeDraggableSource(),
)(Node);

export default NodeDraggable;
