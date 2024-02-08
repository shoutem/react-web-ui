import React, { Component, createRef } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import SunEditor from 'suneditor-react';
import { unsplash } from '../../services';
import EmojiPicker from '../emoji-picker';
import ImagePickerModal from '../image-picker-modal';
import { resolveEditorOptions } from './const';
import customPlugins from './customPlugins';
import 'suneditor/dist/css/suneditor.min.css';
import './style.scss';

const EMOJI_PICKER_STYLE = {
  position: 'absolute',
  zIndex: 6,
  width: 300,
  top: 183,
  right: 12,
};

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const initialValue = _.get(this.props, 'value');
    this.editorRef = createRef();
    this.emojiPickerRef = createRef();

    // Resolve plugins (toolbar options)
    const plugins = [];

    // if there is no unsplashAccessKey, do not create image plugin
    const unsplashAccessKey = _.get(this.props, 'imagePickerOptions.unsplashAccessKey');
    if (!_.isEmpty(unsplashAccessKey)) {
      plugins.push(customPlugins.initImagesCC(
        this.handleShowImagePickerModal,
      ));
    }
   
    plugins.push(customPlugins.initEmojiPicker(
      this.handleToggleEmojiPicker,
    ));

    const allPlugins = [
      ...plugins,
      ...props.customPlugins,
    ];

    this.editorOptions = resolveEditorOptions(allPlugins);

    this.state = {
      rteValue: initialValue,
      showImagePickerModal: false,
    };
  }

  componentWillUnmount() {
    this.editorRef = null;
    this.emojiPickerRef = null;
  }

  handleValueChanged(rteValue) {
    const { onChange } = this.props;

    this.setState({ rteValue }, () => onChange(rteValue));
  }

  handleEmojiSelect(emoji) {
    const { onChange } = this.props;
    const { rteValue } = this.state;

    if (!emoji) {
      return;
    }

    this.setState({ rteValue: rteValue + emoji.native }, () =>
      onChange(rteValue + emoji.native),
    );
  }

  handleShowImagePickerModal() {
    this.setState({ showImagePickerModal: true });
  }

  handleHideImagePickerModal() {
    this.setState({ showImagePickerModal: false });
  }

  handleImagesSelected(images) {
    const { onChange } = this.props;
    const { rteValue } = this.state;

    const imagesHtml = _.map(images, selectedImage => {
      const image = {
        id: _.get(selectedImage, 'id'),
        user: {
          name: _.get(selectedImage, 'user.name'),
          profileUrl: _.get(selectedImage, 'user.links.html'),
        },
        url: _.get(selectedImage, 'urls.full'),
      };

      return unsplash.imageWithDescriptionHtml(image);
    });
    const imagesHtmlString = imagesHtml.join('');

    this.setState({ rteValue: rteValue + imagesHtmlString }, () => {
      onChange(rteValue + imagesHtmlString);
      this.handleHideImagePickerModal();
    });
  }

  handleToggleEmojiPicker() {
    this.emojiPickerRef.current.handleToggleEmojiPicker();
  }

  handleHideEmojiPicker() {
    this.emojiPickerRef.current.hide();
  }

  handleSunEditorInstance(suneditor) {
    this.editorRef.current = suneditor;
  }

  handleOnDrop() {
    // to prevent any objects being droped (image...) and converted to base64
    // we are disabling drag and drop
    return false;
  }

  render() {
    const {
      enableImageAlign,
      enableImageDescription,
      enableImageFormatting,
      enableImagePickerImageSearch,
      enableVideoAlign,
      imagePickerLocalization,
      imagePickerOptions,
      ...otherProps
    } = this.props;
    const { rteValue, showImagePickerModal } = this.state;

    const classes = classNames('rich-text-editor__container', {
      'no-image-formatting': !enableImageFormatting,
      'no-image-description': !enableImageDescription,
      'no-image-align': !enableImageAlign,
      'no-video-align': !enableVideoAlign,
    });
    const shouldShowImagePicker =
      enableImagePickerImageSearch && showImagePickerModal;

    return (
      <div className={classes}>
        <EmojiPicker
          ref={this.emojiPickerRef}
          onSelect={this.handleEmojiSelect}
          showTogglePickerButton={false}
          style={EMOJI_PICKER_STYLE}
        />
        {shouldShowImagePicker && (
          <ImagePickerModal
            options={imagePickerOptions}
            localization={imagePickerLocalization}
            onCloseButtonClick={this.handleHideImagePickerModal}
            onImagesSelected={this.handleImagesSelected}
          />
        )}
        <SunEditor
          {...otherProps}
          getSunEditorInstance={this.handleSunEditorInstance}
          setContents={rteValue}
          onClick={this.handleHideEmojiPicker}
          onChange={this.handleValueChanged}
          onDrop={this.handleOnDrop}
          setOptions={this.editorOptions}
        />
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  customPlugins: PropTypes.array,
  enableImageAlign: PropTypes.bool,
  enableImageDescription: PropTypes.bool,
  enableImageFormatting: PropTypes.bool,
  enableImagePickerImageSearch: PropTypes.bool,
  enableVideoAlign: PropTypes.bool,
  imagePickerLocalization: PropTypes.object,
  imagePickerOptions: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

RichTextEditor.defaultProps = {
  customPlugins: [],
  enableImageAlign: false,
  enableImageDescription: false,
  enableImageFormatting: false,
  enableImagePickerImageSearch: true,
  enableVideoAlign: false,
  imagePickerLocalization: {},
  imagePickerOptions: {},
};
