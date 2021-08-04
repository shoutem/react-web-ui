import React, { Component, createRef } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import EmojiPicker from '../emoji-picker';
import { editorOptions } from './const';
import './style.scss';

const EMOJI_PICKER_STYLE = {
  position: 'absolute',
  zIndex: 6,
  width: 300,
  top: 180,
  right: 12,
};

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.editorRef = createRef();
    const initialValue = _.get(this.props, 'value');

    this.state = {
      rteValue: initialValue,
    };
  }

  componentWillUnmount() {
    this.editorRef = null;
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

  render() {
    const {
      // eslint-disable-next-line no-unused-vars
      onChange,
      enableImageFormatting,
      enableImageAlign,
      enableImageDescription,
      enableVideoAlign,
      ...otherProps
    } = this.props;
    const { rteValue } = this.state;

    const classes = classNames('rich-text-editor__container', {
      'no-image-formatting': !enableImageFormatting,
      'no-image-description': !enableImageDescription,
      'no-image-align': !enableImageAlign,
      'no-video-align': !enableVideoAlign,
    });

    return (
      <div className={classes}>
        <EmojiPicker
          onSelect={this.handleEmojiSelect}
          iconClassName="rich-text-editor__emoji-icon"
          style={EMOJI_PICKER_STYLE}
        />
        <SunEditor
          {...otherProps}
          ref={this.editorRef}
          setContents={rteValue}
          onChange={this.handleValueChanged}
          onClick={this.handleHideEmojiPicker}
          showController={this.showController}
          setOptions={editorOptions}
          class="test-class"
          className="test-class-name"
        />
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  enableImageFormatting: PropTypes.bool,
  enableImageAlign: PropTypes.bool,
  enableImageDescription: PropTypes.bool,
  enableVideoAlign: PropTypes.bool,
};

RichTextEditor.defaultProps = {
  enableImageFormatting: false,
  enableImageAlign: false,
  enableImageDescription: false,
  enableVideoAlign: false,
};
