import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CircularLoader from './CircularLoader';

function renderNoElement({
  isLoading,
  className,
  children,
  ...props
}) {
  const classNameMap = classNames(
    className,
    'loader-container',
  );

  if (isLoading) {
    return (
      <div className={classNameMap}>
        <CircularLoader className="loader" {...props} />
      </div>
    );
  }

  return Children.only(children);
}

function render({
  isLoading,
  className,
  children,
  isOverlay,
  ...props
}) {
  const classNameMap = classNames(
    className,
    'loader-container',
    { 'is-overlay': isOverlay && isLoading }
  );
  const showChildren = !isLoading || isOverlay;

  return (
    <div className={classNameMap}>
      {isLoading && <CircularLoader className="loader" {...props} /> }
      {showChildren && children}
    </div>
  );
}

export default function LoaderContainer({
  withoutWrapper,
  ...props,
}) {
  if (withoutWrapper) {
    return renderNoElement(props);
  }

  return render(props);
}

LoaderContainer.propTypes = {
  className: PropTypes.string,
  /**
   * Indicate to show Loader on true
   */
  isLoading: PropTypes.bool,
  /**
   * children that View wraps
   */
  children: PropTypes.node,
  /**
   * Flag indicating whether loader should hide it's children or just display itself as overlay
   */
  isOverlay: PropTypes.bool,
  /**
   * Flag indicating whether loader should wrap children with <div> wrapper
   */
  withoutWrapper: PropTypes.bool,
};

LoaderContainer.defaultProps = {
  isLoading: false,
};
