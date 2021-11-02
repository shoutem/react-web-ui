import get from 'lodash/get';
import { createApi } from 'unsplash-js';
import logo from '../img/unsplash-logo.png';

const REFERRAL_URL_SUFIX = '/?utm_source=Shoutem&utm_medium=referral';
const HOMEPAGE_URL = `https://www.unsplash.com${REFERRAL_URL_SUFIX}`;
const INVALID_ACCESS_KEY_ERROR_TEXT = 'Invalid Unsplash access key';
const UNSPLASH_CREDIT_ON_TEXT_PART = 'on';
const UNSPLASH_CREDIT_BY_TEXT_PART = 'Photo by';
const UNSPLASH_CREDIT_UNSPLASH_TEXT_PART = ' Unsplash';

function initApi(accessKey) {
  if (accessKey) {
    return createApi({ accessKey });
  }

  return null;
}

async function searchImages(api, query, perPage) {
  try {
    const result = await api.search.getPhotos({ query, perPage });

    return get(result, 'response.results', []);
  } catch (error) {
    return [];
  }
}

function trackImageDownload(api, downloadLocation) {
  api.photos.trackDownload({ downloadLocation });
}

function imageWithDescriptionHtml(image) {
  return `<div
      id="unsplash-image-container"
      class="se-component se-image-container __se__float-none"
      contenteditable="false"
      style="display: flex; flex-direction: column; align-items: center;"
    >
      <figure style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <img
          id="unsplash-image"
          src=${image.url}
          data-proportion="true"
          data-file-name="${image.id}.png"
          style="width: 475px;"
        />
        <div id="unsplash-image-description-container"><span>Photo by <a href="${image.user.profileUrl}${REFERRAL_URL_SUFIX}" target="_blank">${image.user.name}</a> on <a href="${HOMEPAGE_URL}" target="_blank">Unsplash</a></span></div>
        </figure>
        </div><br>`;
}

export default {
  HOMEPAGE_URL,
  imageWithDescriptionHtml,
  initApi,
  INVALID_ACCESS_KEY_ERROR_TEXT,
  logo,
  REFERRAL_URL_SUFIX,
  searchImages,
  trackImageDownload,
  UNSPLASH_CREDIT_ON_TEXT_PART,
  UNSPLASH_CREDIT_BY_TEXT_PART,
  UNSPLASH_CREDIT_UNSPLASH_TEXT_PART,
};
