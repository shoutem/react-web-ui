import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { unsplash } from '../../../../services';
import './style.scss';

function SelectableImagePreview({
  authorName,
  authorLink,
  image,
  isSelected,
  localization,
  onSelectImage,
  url,
}) {
  const containerClasses = classNames('selectable-image-preview__container', {
    'is-selected': isSelected,
  });
  const overlayClasses = classNames('selectable-image-preview__overlay', {
    'is-selected': isSelected,
  });
  const {
    onText = unsplash.UNSPLASH_CREDIT_ON_TEXT_PART,
    photoByText = unsplash.UNSPLASH_CREDIT_BY_TEXT_PART,
    unsplashText = unsplash.UNSPLASH_CREDIT_UNSPLASH_TEXT_PART,
  } = localization;

  return (
    <div className={containerClasses} onClick={() => onSelectImage(image)}>
      <img className="selectable-image-preview__image-preview" src={url} />
      <div className={overlayClasses}>
        <div className="selectable-image-preview__image-info-container">
          {photoByText}
          <a
            className="selectable-image-preview__link-text"
            href={authorLink}
            target="_blank"
          >
            {' '}
            {authorName}
          </a>{' '}
          {onText}{' '}
          <a
            className="selectable-image-preview__link-text"
            href={unsplash.HOMEPAGE_URL}
            target="_blank"
          >
            {' '}
            {unsplashText}
          </a>
        </div>
      </div>
    </div>
  );
}

SelectableImagePreview.propTypes = {
  authorName: PropTypes.string,
  authorLink: PropTypes.string,
  image: PropTypes.object,
  isSelected: PropTypes.bool,
  onSelectImage: PropTypes.func,
  url: PropTypes.string,
};

SelectableImagePreview.defaultProps = {
  isSelected: false,
  localization: {},
};

export default React.memo(SelectableImagePreview);
