import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, HelpBlock } from 'react-bootstrap';
import { LoaderContainer } from '../../../loader';
import SearchInput from '../../../search-input';
import { unsplash } from '../../../../services';
import SelectableImagePreview from '../selectable-image-preview';
import EmptyStateView from '../EmptyStateView';
import './style.scss';

const IMAGES_PER_PAGE = 30;
const INSERT_BUTTON_TEXT_SINGULAR = 'Insert image';
const INSERT_BUTTON_TEXT_PLURAL = 'Insert images';
const SEARCH_INPUT_PLACEHOLDER = 'Search';
const MAX_TEXT = 'Max';

function resolveInsertButtonText(
  maxSelectableImages,
  singularText,
  pluralText,
) {
  if (maxSelectableImages === 1) {
    return singularText;
  }

  return pluralText;
}

export default class UnsplashImagesPicker extends PureComponent {
  static propTypes = {
    accessKey: PropTypes.string.isRequired,
    localization: PropTypes.object,
    maxSelectableImages: PropTypes.number,
    onImagesSelected: PropTypes.func,
  };

  static defaultProps = {
    // undefined = infinity
    maxSelectableImages: undefined,
    localization: {},
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.unsplashApi = unsplash.initApi(props.accessKey);

    this.state = {
      images: [],
      selectedImages: [],
      searchText: '',
      isLoading: false,
    };
  }

  handleImagesSelected() {
    const { onImagesSelected } = this.props;
    const { selectedImages } = this.state;

    _.forEach(selectedImages, (image) =>
      unsplash.trackImageDownload(
        this.unsplashApi,
        image.links.download_location,
      ),
    );
    onImagesSelected(selectedImages);
  }

  handleSearchInputChange(searchQuery) {
    const searchText = searchQuery.value;

    if (_.isEmpty(searchText)) {
      return this.setState({ images: [], searchText: '', selectedImages: [] });
    }

    this.setState({ isLoading: true, searchText }, () => {
      unsplash
        .searchImages(this.unsplashApi, searchText, IMAGES_PER_PAGE)
        .then((images) =>
          this.setState({
            images,
            isLoading: false,
            selectedImages: [],
          }),
        )
        .catch(() => this.setState({ isLoading: false }));
    });
  }

  handleSelectImage(selectedImage) {
    const { maxSelectableImages } = this.props;
    const { selectedImages } = this.state;

    if (maxSelectableImages === 1) {
      return this.setState({ selectedImages: [selectedImage] });
    }

    let newSelectedImages = [...selectedImages];

    if (newSelectedImages.includes(selectedImage)) {
      newSelectedImages = newSelectedImages.filter(
        (image) => image !== selectedImage,
      );

      return this.setState({ selectedImages: newSelectedImages });
    }

    if (
      !maxSelectableImages ||
      newSelectedImages.length < maxSelectableImages
    ) {
      newSelectedImages.push(selectedImage);

      return this.setState({ selectedImages: newSelectedImages });
    }

    return null;
  }

  render() {
    const { localization, maxSelectableImages } = this.props;
    const { images, isLoading, searchText, selectedImages } = this.state;

    const insertButtonDisabled =
      _.isEmpty(searchText) || _.isEmpty(selectedImages);

    const {
      emptySearchTermTitle,
      emptySearchTermDescription,
      emptySearchResultsTitle,
      emptySearchResultsDescription,
      imagePreviewOnText,
      imagePreviewPhotoByText,
      imagePreviewUnsplashText,
      insertButtonTextSingular = INSERT_BUTTON_TEXT_SINGULAR,
      insertButtonTextPlural = INSERT_BUTTON_TEXT_PLURAL,
      invalidAccessKeyErrorText = unsplash.INVALID_ACCESS_KEY_ERROR_TEXT,
      maxText = MAX_TEXT,
      searchInputPlaceholder = SEARCH_INPUT_PLACEHOLDER,
    } = localization;
    const imagePreviewLocalization = {
      onText: imagePreviewOnText,
      photoByText: imagePreviewPhotoByText,
      unsplashText: imagePreviewUnsplashText,
    };
    const emptyStateViewLocalization = {
      emptySearchTermTitle,
      emptySearchTermDescription,
      emptySearchResultsTitle,
      emptySearchResultsDescription,
    };

    if (!this.unsplashApi) {
      return <HelpBlock>{invalidAccessKeyErrorText}</HelpBlock>;
    }

    const resolvedInsertButtonText = resolveInsertButtonText(
      maxSelectableImages,
      insertButtonTextSingular,
      insertButtonTextPlural,
    );

    const shouldShowMaxSelectableImagesText = maxSelectableImages > 1;
    const maxSelectableImagesText = `${maxText} ${maxSelectableImages}`;
    const shouldRenderSearchResults = !_.isEmpty(images);
    const shouldRenderEmptySearchPlaceholder =
      _.isEmpty(images) && _.isEmpty(searchText);
    const shouldRenderNoSearchResultsPlaceholder =
      _.isEmpty(images) && !_.isEmpty(searchText);
    const shouldRenderEmptyPlaceholder =
      shouldRenderEmptySearchPlaceholder ||
      shouldRenderNoSearchResultsPlaceholder;

    return (
      <div className="unsplash-images-tab__container">
        <div className="unsplash-images-tab__search-container">
          <SearchInput
            className="unsplash-images-tab__search-input"
            onChange={this.handleSearchInputChange}
            placeholder={searchInputPlaceholder}
          />
          <Button
            className="btn btn-primary"
            disabled={insertButtonDisabled}
            onClick={this.handleImagesSelected}
          >
            {resolvedInsertButtonText}
          </Button>
          {shouldShowMaxSelectableImagesText && (
            <div className="unsplash-images-tab__max-images-text">
              {maxSelectableImagesText}
            </div>
          )}
        </div>
        <LoaderContainer
          isLoading={isLoading}
          className="unsplash-images-tab__results-container"
          size="50px"
        >
          {shouldRenderEmptyPlaceholder && (
            <EmptyStateView
              emptySearchResults={shouldRenderNoSearchResultsPlaceholder}
              emptySearchTerm={shouldRenderEmptySearchPlaceholder}
              localization={emptyStateViewLocalization}
            />
          )}
          {shouldRenderSearchResults &&
            _.map(images, (imageItem) => {
              const authorLink = `${imageItem.user.links.html}${unsplash.REFERRAL_URL_SUFIX}`;

              return (
                <SelectableImagePreview
                  image={imageItem}
                  authorName={imageItem.user.name}
                  authorLink={authorLink}
                  isSelected={_.includes(selectedImages, imageItem)}
                  localization={imagePreviewLocalization}
                  onSelectImage={this.handleSelectImage}
                  url={imageItem.urls.small}
                />
              );
            })}
        </LoaderContainer>
      </div>
    );
  }
}
