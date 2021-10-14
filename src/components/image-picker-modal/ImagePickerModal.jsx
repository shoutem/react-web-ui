import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import { resolveReactComponent } from '../../services';
import FontIcon from '../font-icon';
import { UnsplashFooter, UnsplashImagesPicker } from './components';
import './style.scss';

const IMAGE_SEARCH_TAB_TITLE = 'Free images';
const MODAL_TITLE = 'Insert images';

function ImagePickerModal({
  CustomFooterComponent,
  customFooterComponentProps,
  CustomHeaderComponent,
  customHeaderComponentProps,
  CustomImagesSelectTabComponent,
  customImagesSelectTabComponentProps,
  localization,
  onCloseButtonClick,
  onImagesSelected,
  options,
}) {
  const {
    footerText: footerText,
    insertButtonTextSingular,
    insertButtonTextPlural,
    invalidUnsplashKeyText: invalidAccessKeyErrorText,
    imagePreviewOnText,
    imagePreviewPhotoByText,
    imagePreviewUnsplashText,
    maxText,
    searchTabTitle: imageSearchTabTitle = IMAGE_SEARCH_TAB_TITLE,
    modalTitle: modalTitle = MODAL_TITLE,
    searchPlaceholder: searchInputPlaceholder,
  } = localization;

  const unsplashImagesPickerLocalization = {
    insertButtonTextSingular,
    insertButtonTextPlural,
    invalidAccessKeyErrorText,
    imagePreviewOnText,
    imagePreviewPhotoByText,
    imagePreviewUnsplashText,
    maxText,
    searchInputPlaceholder,
  };

  const ResolvedCustomFooterComponent = resolveReactComponent(
    CustomFooterComponent,
    customFooterComponentProps,
  );
  const ResolvedCustomHeaderComponent = resolveReactComponent(
    CustomHeaderComponent,
    customHeaderComponentProps,
  );
  const ResolvedCustomImagesSelectTabComponent = resolveReactComponent(
    CustomImagesSelectTabComponent,
    customImagesSelectTabComponentProps,
  );

  return (
    <Modal bsSize="large" show>
      {!CustomHeaderComponent && (
        <Modal.Header>
          <Modal.Title>
            <div className="image-picker-modal__header-container">
              <FontIcon
                className="image-picker-modal__close-button"
                name="close"
                onClick={onCloseButtonClick}
                size="18px"
              />
              {modalTitle}
            </div>
          </Modal.Title>
        </Modal.Header>
      )}
      {CustomHeaderComponent && ResolvedCustomHeaderComponent}
      <Modal.Body>
        <Tabs
          id="image-picker-modal-tabs"
          className="image-picker-modal-tabs"
          defaultActiveKey="3rdPartyImages"
        >
          <Tab
            key="3rdPartyImages"
            eventKey="3rdPartyImages"
            title={imageSearchTabTitle.toUpperCase()}
          >
            {!CustomImagesSelectTabComponent && (
              <UnsplashImagesPicker
                accessKey={options.unsplashAccessKey}
                localization={unsplashImagesPickerLocalization}
                onImagesSelected={onImagesSelected}
                maxSelectableImages={options.maxSelectableImages}
              />
            )}
            {CustomImagesSelectTabComponent &&
              ResolvedCustomImagesSelectTabComponent}
          </Tab>
        </Tabs>
      </Modal.Body>
      {!CustomFooterComponent && (
        <Modal.Footer>
          <UnsplashFooter footerText={footerText} />
        </Modal.Footer>
      )}
      {CustomFooterComponent && ResolvedCustomFooterComponent}
    </Modal>
  );
}

ImagePickerModal.propTypes = {
  CustomFooterComponent: PropTypes.node,
  customFooterComponentProps: PropTypes.object,
  CustomHeaderComponent: PropTypes.node,
  customHeaderComponentProps: PropTypes.object,
  CustomImagesSelectTabComponent: PropTypes.node,
  customImagesSelectTabComponentProps: PropTypes.object,
  localization: PropTypes.object,
  onCloseButtonClick: PropTypes.func,
  onImagesSelected: PropTypes.func,
  options: PropTypes.shape({
    accessKey: PropTypes.string.isRequired,
    maxSelectableImages: PropTypes.number,
  }),
};

ImagePickerModal.defaultProps = {
  localization: {},
  options: {
    accessKey: null,
    // undefined = infinity
    maxSelectableImages: undefined,
  },
};

export default React.memo(ImagePickerModal);
