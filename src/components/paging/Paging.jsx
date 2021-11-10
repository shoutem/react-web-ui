import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Pager } from 'react-bootstrap';
import FontIcon from '../font-icon';
import './style.scss';

function calculatePageCount(itemCount, limit) {
  if (!itemCount) {
    return null;
  }

  if (limit === 0) {
    return 0;
  }

  return _.ceil(itemCount / limit);
}

function calculatePageIndex(limit, offset) {
  if (limit === 0) {
    return 0;
  }

  return offset / limit;
}

function calculateOffset(limit, pageIndex) {
  return limit * pageIndex;
}

function calculatePageLabel(currentPage, pageCount) {
  if (!pageCount) {
    return `Page ${currentPage}`;
  }

  return `${currentPage} of ${pageCount}`;
}

/**
 * Paging component.
 *
 * Rendered with buttons for jumping to next and previous page.
 * Displays label `n of m` where `n` is current page number and `m` is total page number.
 * Total page number is calculated from props. If it cannot be calculated, displays only `Page n`.
 *
 * Two functions can be called from outside:
 * `reset` - resets paging state to initial
 * `getPagingInfo` - returns current paging limit, offset, pageCount and pageIndex.
 */
export default class Paging extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  // eslint-disable-next-line react/sort-comp
  checkData(nextProps, props = {}) {
    const {
      limit: nextLimit,
      offset: nextOffset,
      itemCount: nextItemCount,
    } = nextProps;

    const { limit, offset, itemCount } = props;

    const pagingHasChanged =
      nextLimit !== limit ||
      nextOffset !== offset ||
      nextItemCount !== itemCount;

    if (pagingHasChanged) {
      const pageIndex = calculatePageIndex(nextLimit, nextOffset);
      const pageCount = calculatePageCount(nextItemCount, nextLimit);

      this.setState({
        pageIndex,
        pageCount,
      });
    }
  }

  reset() {
    const { itemCount, limit, offset } = this.props;
    const pageIndex = calculatePageIndex(limit, offset);
    const pageCount = calculatePageCount(itemCount, limit);

    this.setState({
      pageIndex,
      pageCount,
    });
  }

  getPagingInfo() {
    const { limit } = this.props;
    const { pageIndex, pageCount } = this.state;
    const offset = calculateOffset(limit, pageIndex);

    return {
      limit,
      offset,
      pageIndex,
      pageCount,
    };
  }

  hasPreviousPage() {
    const { hasPrevious } = this.props;
    const { pageIndex } = this.state;

    if (!_.isUndefined(hasPrevious)) {
      return hasPrevious;
    }

    return pageIndex > 0;
  }

  hasNextPage() {
    const { hasNext } = this.props;
    const { pageCount, pageIndex } = this.state;

    if (!_.isUndefined(hasNext)) {
      return hasNext;
    }

    return !pageCount || pageIndex + 1 < pageCount;
  }

  handlePreviousPageClick() {
    const { pageIndex } = this.state;

    if (!this.hasPreviousPage()) {
      return;
    }

    this.props.onPreviousPageClick();
    this.setState({
      pageIndex: pageIndex - 1,
    });
  }

  handleNextPageClick() {
    const { pageIndex } = this.state;

    if (!this.hasNextPage()) {
      return;
    }

    this.props.onNextPageClick();
    this.setState({
      pageIndex: pageIndex + 1,
    });
  }

  render() {
    const { pageIndex, pageCount } = this.state;
    const { resolvePageLabel } = this.props;

    const hasNext = this.hasNextPage();
    const hasPrevious = this.hasPreviousPage();

    const pageNumber = pageIndex + 1;
    const displayLabel = resolvePageLabel(pageNumber, pageCount);

    return (
      <Pager className="paging pull-right">
        <Pager.Item
          className="paging__item left"
          disabled={!hasPrevious}
          onClick={this.handlePreviousPageClick}
        >
          <FontIcon name="arrow-left" size="24px" />
        </Pager.Item>
        <span className="paging__description">{displayLabel}</span>
        <Pager.Item
          className="paging__item right"
          disabled={!hasNext}
          onClick={this.handleNextPageClick}
        >
          <FontIcon name="arrow-right" size="24px" />
        </Pager.Item>
      </Pager>
    );
  }
}

Paging.propTypes = {
  /**
   * Page limit, number of items per page
   */
  limit: PropTypes.number,
  /**
   * Page offset
   */
  offset: PropTypes.number,
  /**
   * Total number of items
   */
  itemCount: PropTypes.number,
  /**
   * Function called when next page is selected
   */
  onNextPageClick: PropTypes.func,
  /**
   * Function called when previous page is selected
   */
  onPreviousPageClick: PropTypes.func,
  /**
   * Flag indicating whether next page exists.
   * If not provided, paging component will calculate this on its own if limit,
   * offset and itemCount are provided.
   */
  hasNext: PropTypes.bool,
  /**
   * Flag indicating whether previous page exists.
   * If not provided, paging component will calculate this on its own if limit,
   * offset and itemCount are provided.
   */
  hasPrevious: PropTypes.bool,
  /**
   * Function used for calculating the display label for the current page.
   * Two input parameters are provided to this component: `currentPage` and `pageCount`.
   * `pageCount` is only provided if it can be calculated (`itemCount` is provided).
   */
  resolvePageLabel: PropTypes.func,
};

Paging.defaultProps = {
  limit: 10,
  offset: 0,
  resolvePageLabel: calculatePageLabel,
};
