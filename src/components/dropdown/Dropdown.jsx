import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import './style.scss';

export default class EnhancedDropdown extends Dropdown {
  constructor(props, context) {
    super(props, context);

    this.updateDropdownState = this.updateDropdownState.bind(this);
    this.onDropdownToggle = this.onDropdownToggle.bind(this);
    this.onEnter = this.onEnter.bind(this);

    this.state = {
      dropup: this.props.dropup,
      pullRight: this.props.pullRight,
      ready: false,
      entered: false,
    };
  }

  onEnter() {
    this.setState({
      entered: true,
    });
  }

  /*
   * Opens to bottom left by default; takes dropup and pullRight props in
   * consideration when calculating the new state
   */
  updateDropdownState() {
    const dropdownMenu = findDOMNode(this).querySelector('.dropdown-menu');
    const overlaps = this.getElementScreenOverlaps(dropdownMenu);
    const {
      overlapsTop,
      overlapsRight,
      overlapsBottom,
      overlapsLeft,
    } = overlaps;
    const dropup = overlapsBottom || (this.props.dropup && !overlapsTop);
    const pullRight = overlapsLeft || (this.props.pullRight && !overlapsRight);

    this.setState({
      dropup,
      pullRight,
      ready: true,
    });

    requestAnimationFrame(this.onEnter);
  }

  onDropdownToggle(open) {
    // call the outer level toggle function, if supplied
    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle.call(this, open);
    }

    if (!open) {
      return;
    }

    /**
     * These need to be reset to default values to assure dropdown's
     * default positioning (on which we base the calculations)
     */
    this.setState({
      dropup: this.props.dropup,
      pullRight: this.props.pullRight,
      ready: false,
      entered: false,
    });

    /**
     * The only way to make sure that a callback is executed after a node
     * has been both attached to DOM _and_ painted
     */
    requestAnimationFrame(this.updateDropdownState);
  }

  /**
   * Returns the amount of pixels scrolled,
   * both horizontally and vertically
   */
  getDocumentScrollOffset() {
    const w = window;
    const h = document.documentElement;
    const b = document.body;
    return {
      x: w.pageXOffset ? w.pageXOffset : Math.max(h.scrollLeft, b.scrollLeft),
      y: w.pageYOffset ? w.pageYOffset : Math.max(h.scrollTop, b.scrollTop),
    };
  }

  /**
   * Returns a bool for each screen edge: true if the element's
   * bounding box is overlaping the screen edge, meaning the element
   * is not completely on screen
   */
  getElementScreenOverlaps(el) {
    const elRect = el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const scrolled = this.getDocumentScrollOffset();

    return {
      overlapsTop: elRect.top < bodyRect.top + scrolled.y,
      overlapsRight: elRect.right > bodyRect.right - scrolled.x,
      overlapsBottom: elRect.bottom > bodyRect.bottom + scrolled.y,
      overlapsLeft: elRect.left < bodyRect.left + scrolled.x,
    };
  }

  render() {
    const classNameMap = classNames(this.props.className, 'enhanced-dropdown', {
      ready: this.state.ready,
      entered: this.state.entered,
    });

    return (
      <Dropdown
        {...this.props}
        dropup={this.state.dropup}
        pullRight={this.state.pullRight}
        onToggle={this.onDropdownToggle}
        className={classNameMap}
      />
    );
  }
}
