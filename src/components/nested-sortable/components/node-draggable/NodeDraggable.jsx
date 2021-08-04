import _ from 'lodash';
import NodeDraggableTarget from './NodeDraggableTarget';
import NodeDraggableSource from './NodeDraggableSource';
import Node from '../node/index';

const NodeDraggable = _.flow(
  new NodeDraggableTarget(),
  new NodeDraggableSource()
)(Node);

export default NodeDraggable;
