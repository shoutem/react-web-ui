import React from 'react';
import PropTypes from 'prop-types';
import { unsplash } from '../../../../services';

function UnsplashFooter({ footerText }) {
  return (
    <div>
      {footerText}{' '}
      <a href={unsplash.HOMEPAGE_URL} target="_blank">
        <img
          className="image-picker-modal__unsplash-logo"
          src={unsplash.logo}
        />
      </a>
    </div>
  );
}

UnsplashFooter.propTypes = {
  footerText: PropTypes.string,
};

UnsplashFooter.defaultProps = {
  footerText: 'The internet’s source of freely-usable images. by',
};

export default React.memo(UnsplashFooter);
