import React from 'react';
import PropTypes from 'prop-types';
import EmptyResourcePlaceholder from '../../../empty-resource-placeholder';

const EMPTY_SEARCH_TERM_TITLE = 'No images';
const EMPTY_SEARCH_TERM_DESCRIPTION =
  'Please enter the search term in the text input and choose your free image';
const EMPTY_SEARCH_RESULTS_TITLE = 'Nothing found';
const EMPTY_SEARCH_RESULTS_DESCRIPTION =
  'Please enter a different search term to find images';

function resolveTitle(emptySearchTerm, emptySearchResults, localization) {
  if (emptySearchTerm) {
    return localization.emptySearchTermTitle || EMPTY_SEARCH_TERM_TITLE;
  }

  if (emptySearchResults) {
    return localization.emptySearchResultsTitle || EMPTY_SEARCH_RESULTS_TITLE;
  }

  return '';
}

function resolveDescription(emptySearchTerm, emptySearchResults, localization) {
  if (emptySearchTerm) {
    return (
      localization.emptySearchTermDescription || EMPTY_SEARCH_TERM_DESCRIPTION
    );
  }

  if (emptySearchResults) {
    return (
      localization.emptySearchResultsDescription ||
      EMPTY_SEARCH_RESULTS_DESCRIPTION
    );
  }

  return '';
}

function EmptyStateView({ emptySearchTerm, emptySearchResults, localization }) {
  return (
    <div>
      <EmptyResourcePlaceholder
        className="empty-extensions-search-results-placeholder"
        imageSrc="/img/empty-state-search.svg"
        title={resolveTitle(emptySearchTerm, emptySearchResults, localization)}
        imageSize="144px"
      >
        <span>
          {resolveDescription(
            emptySearchTerm,
            emptySearchResults,
            localization,
          )}
        </span>
      </EmptyResourcePlaceholder>
    </div>
  );
}

EmptyStateView.propTypes = {
  emptySearchResults: PropTypes.bool,
  emptySearchTerm: PropTypes.bool,
  localization: PropTypes.object,
};

EmptyStateView.defaultProps = {
  emptySearchResults: false,
  emptySearchTerm: false,
  localization: {},
};

export default React.memo(EmptyStateView);
