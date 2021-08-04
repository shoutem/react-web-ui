import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';
import NodeDraggable from './components/node-draggable/index';
import _ from 'lodash';
import './style.scss';

/**
 * Component that can be used for rendering nestable list aka trees. It support nesting,
 * different rendering layouts of nodes, DnD, disabling of all functionality per tree or node.
 * NestedSortable DnD is based on React DnD library. Idea is to track all drag nad hover events
 * from DragSource and DropTarget. Based on drag node and hover node and structure of tree,
 * NestedSortable automatically calculates moving in tree persisted in component state.
 * Only on DnD finish, event onDragAndDropComplete is fired with arguments source node
 * and target node as consequence of drag, hover and ultimately drop event.
 * NestedSortable will automatically keep its internal tree structure updated when you
 * drag and drop nodes around. Use onDragAndDropComplete event to update a remote resource
 * (e.g. using api calls) on every tree change. Source and target will be provided as arguments,
 * they both consist of: a node reference and an index. Source object will point to a PARENT of
 * the node which was dragged and index will be the child index in parents children array. On the
 * same note, target will point to the new PARENT of the node that was dragged and index will point
 * to a position in the new parent's children array where the item should be inserted.
 */
class NestedSortable extends Component {
  constructor(props) {
    super(props);
    this.moveNode = this.moveNode.bind(this);
    this.calculateDestination = this.calculateDestination.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.isHovered = this.isHovered.bind(this);
    this.onHoverChange = this.onHoverChange.bind(this);
    this.onToggleCollapse = this.onToggleCollapse.bind(this);
    this.isCollapsed = this.isCollapsed.bind(this);
    this.onDragAndDropStart = this.onDragAndDropStart.bind(this);
    this.onDragAndDropComplete = this.onDragAndDropComplete.bind(this);
    this.createNodeMap = this.createNodeMap.bind(this);
    this.createParentNodeMap = this.createParentNodeMap.bind(this);
    this.calculateNodePredecessors = this.calculateNodePredecessors.bind(this);
    this.updateStateWithProps = this.updateStateWithProps.bind(this);

    this.state = {
      collapsed: {},
      hoveredId: '',
      isDragging: false,
    };
  }

  componentWillMount() {
    this.updateStateWithProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isDragging) {
      return;
    }

    if (nextProps.selectedId !== this.props.selectedId ||
      !_.isEqual(this.props.tree, nextProps.tree)) {
      this.updateStateWithProps(nextProps);
    }
  }

  // eslint-disable-next-line react/sort-comp
  updateStateWithProps(props) {
    const { tree, selectedId } = props;
    const nodes = this.createNodeMap(tree);
    const nodeParents = this.createParentNodeMap(tree);
    const selectedNodePredecessors = this.calculateNodePredecessors(selectedId, nodeParents);

    this.setState({
      tree,
      selectedId,
      nodes,
      nodeParents,
      selectedNodePredecessors,
    });
  }

  onToggleCollapse(nodeId) {
    const collapsed = {
      ...this.state.collapsed,
      [nodeId]: !this.isCollapsed(nodeId),
    };

    this.setState({ collapsed });
  }

  onHoverChange(nodeId, isHover) {
    const hoveredId = isHover ? nodeId : '';
    this.setState({ hoveredId });
  }

  onDragAndDropStart() {
    this.setState({ isDragging: true });
  }

  onDragAndDropComplete(source, target) {
    this.setState({ isDragging: false });
    this.props.onDragAndDropComplete(source, target);
  }

  isCollapsed(nodeId) {
    const { collapsed, selectedNodePredecessors } = this.state;
    const { collapseAll, expandSelectedSubtree } = this.props;

    if (_.has(collapsed, nodeId)) {
      return collapsed[nodeId];
    }

    if (expandSelectedSubtree && _.includes(selectedNodePredecessors, nodeId)) {
      return false;
    }

    return collapseAll;
  }

  isSelected(nodeId) {
    return this.state.selectedId === nodeId;
  }

  isHovered(nodeId) {
    return this.state.hoveredId === nodeId;
  }

  createNodeMap(nodes) {
    if (_.isEmpty(nodes)) {
      return {};
    }

    return _.reduce(nodes, (result, node) => ({
      ...result,
      [node.id]: node,
      ...this.createNodeMap(node.children),
    }), {});
  }

  createParentNodeMap(nodes, parentId) {
    if (_.isEmpty(nodes)) {
      return {};
    }

    return _.reduce(nodes, (result, node) => {
      const newResult = {
        ...result,
        ...this.createParentNodeMap(node.children, node.id),
      };

      if (parentId) {
        newResult[node.id] = parentId;
      }

      return newResult;
    }, {});
  }

  calculateNodePredecessors(nodeId, nodeParents) {
    if (!nodeId) {
      return [];
    }

    const nodeParentId = nodeParents[nodeId];
    if (!nodeParentId) {
      return [];
    }

    return [
      nodeParentId,
      ...this.calculateNodePredecessors(nodeParentId, nodeParents),
    ];
  }

  calculateDestination(
    dragParentNode,
    dragIndex,
    hoverParentNode,
    hoverIndex,
    levelChange = 0
  ) {
    // Checks if all conditions for moving node into nestable node are satisfied
    // and if are, returns destination object that will move node to tail of it's previous
    // sibling children's array. Conditions are based on checking if sibling with
    // index (i-1) exists and does it accepts children, if so we additionally ensure
    // it's not collapsed.
    if (levelChange < 0 && dragParentNode && dragIndex > 0) {
      const previousSiblingNode = dragParentNode.children[dragIndex - 1];
      const isPreviousSiblingNodeCollapsed = this.state.collapsed[previousSiblingNode.id];
      if (previousSiblingNode.isNestable && !isPreviousSiblingNodeCollapsed) {
        return {
          parentNode: previousSiblingNode,
          index: previousSiblingNode.children.length,
        };
      }
    }

    // Checks if all conditions for moving node out from nestable node are satisfied
    // and if are, returns destination object that will move node outside it's parent
    // to become parent's next sibling. Conditions are based on checking if node is
    // last in parent's children array and if grandfather exists (in case of root elements)
    // it doesn't.
    if (levelChange > 0 && dragParentNode) {
      // only last child in nestable node can be dragged one level-up
      const isLast = dragParentNode.children.length === dragIndex + 1;
      const grandParentNodeId = this.state.nodeParents[dragParentNode.id];
      const grandParentNode = grandParentNodeId && this.state.nodes[grandParentNodeId];
      if (isLast && grandParentNode) {
        const parentIndex = _.findIndex(grandParentNode.children, ['id', dragParentNode.id]);
        return {
          parentNode: grandParentNode,
          index: parentIndex + 1,
        };
      }
    }

    // Normal case based on vertical movement where only information from hoverProps
    // are used to determine destination.
    return {
      parentNode: hoverParentNode,
      index: hoverIndex,
    };
  }

  updateTree(sourceNode, sourceIndex, destination) {
    const { tree } = this.state;

    // Root nodes have sourceNode undefined, so we use tree as reference to root elements
    const node = sourceNode ? sourceNode.children[sourceIndex] : tree[sourceIndex];
    const sourceNodeChildren = _.get(sourceNode, 'children', tree);
    const destinationNodeChildren = _.get(destination, 'parentNode.children', tree);

    // Moving node by update parents children array
    sourceNodeChildren.splice(sourceIndex, 1);
    destinationNodeChildren.splice(destination.index, 0, node);

    // Set new state, marking component to re-render
    this.setState({ tree });
  }

  moveNode(dragParentId, dragIndex, hoverParentId, hoverIndex, levelChange = 0) {
    // Find parent nodes based on ids
    const dragParentNode = this.state.nodes[dragParentId];
    const hoverParentNode = this.state.nodes[hoverParentId];

    // Based on received arguments, calculate destination parameters
    // There are a few patterns that need to be checked
    // If movement isn't possible returns undefined
    const destination = this.calculateDestination(
      dragParentNode,
      dragIndex,
      hoverParentNode,
      hoverIndex,
      levelChange
    );

    // Cancel move if destination is not feasible
    if (!destination) {
      return null;
    }

    this.updateTree(dragParentNode, dragIndex, destination);

    // We need to return destination info to NodeDraggable so it can make
    // adjustments on React DnD.
    return {
      index: destination.index,
      parentId: _.get(destination.parentNode, 'id'),
    };
  }

  render() {
    const nestedSortableClasses = classNames(
      this.props.className,
      'nested-sortable'
    );

    return (
      <div className={nestedSortableClasses}>
        {this.state.tree.map((item, i) =>
          <NodeDraggable
            key={item.id}
            item={item}
            index={i}
            level={0}
            move={this.moveNode}
            isSelected={this.isSelected}
            onSelect={this.props.onSelect}
            isHorizontal={this.props.isHorizontal}
            isHovered={this.isHovered}
            onHoverChange={this.onHoverChange}
            isCollapsed={this.isCollapsed}
            onToggleCollapse={this.onToggleCollapse}
            onDragAndDropStart={this.onDragAndDropStart}
            onDragAndDropComplete={this.onDragAndDropComplete}
            isDraggable={item.isDraggable}
            isNestable={item.isNestable}
            hasUpdates={item.hasUpdates}
            nodeHeaderTemplate={this.props.nodeHeaderTemplate}
            doesParentAllowDrop={!this.props.disableDropIntoRoot}
            offset={this.props.offset}
            step={this.props.step}
            showDragHandle={this.props.showDragHandle}
          />
        )}
      </div>
    );
  }
}

NestedSortable.propTypes = {
  className: PropTypes.string,
  tree: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    isNestable: PropTypes.bool,
    hasUpdates: PropTypes.bool,
    isDraggable: PropTypes.bool,
    isRoot: PropTypes.bool,
    disableDrop: PropTypes.bool,
    children: PropTypes.array,
    // Node can hold additional attributes that will be used in combination
    // with nodeHeaderTemplate function
  })).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func,
  nodeHeaderTemplate: PropTypes.func,
  onDragAndDropComplete: PropTypes.func,
  disableDropIntoRoot: PropTypes.bool,
  offset: PropTypes.number,
  step: PropTypes.number,
  expandSelectedSubtree: PropTypes.bool,
  collapseAll: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  showDragHandle: PropTypes.bool,
};

NestedSortable.defaultProps = {
  disableDropIntoRoot: false,
  offset: 8,
  step: 16,
  tree: [],
  isHorizontal: false,
};

export default new DragDropContext(HTML5Backend)(NestedSortable);
