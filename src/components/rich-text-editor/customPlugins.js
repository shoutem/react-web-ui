// Docs on custom plugins: http://suneditor.com/sample/html/customPlugins.html

const IMAGESCC_CUSTOM_PLUGIN = 'imagesCCcustomPlugin';
const EMOJI_CUSTOM_PLUGIN = 'emojiCustomPlugin';

const initImagesCC = (onImagesButtonClick) => ({
  definition: {
    name: IMAGESCC_CUSTOM_PLUGIN,
    display: 'command',
    add: () => {},
    action: onImagesButtonClick,
  },
  toolbarComponent: {
    name: IMAGESCC_CUSTOM_PLUGIN,
    dataCommand: IMAGESCC_CUSTOM_PLUGIN,
    title: 'Image',
    dataDisplay: 'command',
    innerHTML:
      '<span class="font-icon se-icon se-icon-imagecreativecommons" style="font-size: 24px;"></span>',
  },
});

const initEmojiPicker = (onEmojiButtonClick) => ({
  definition: {
    name: EMOJI_CUSTOM_PLUGIN,
    display: 'command',
    add: () => {},
    action: onEmojiButtonClick,
  },
  toolbarComponent: {
    name: EMOJI_CUSTOM_PLUGIN,
    dataCommand: EMOJI_CUSTOM_PLUGIN,
    buttonClass: '',
    title: 'Emoji',
    dataDisplay: 'command',
    innerHTML:
      '<span class="font-icon se-icon se-icon-emoticon" style="font-size: 24px;"></span>',
  },
});

export default {
  IMAGESCC_CUSTOM_PLUGIN,
  EMOJI_CUSTOM_PLUGIN,
  initImagesCC,
  initEmojiPicker,
};
