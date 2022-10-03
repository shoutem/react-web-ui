// Docs on custom plugins: http://suneditor.com/sample/html/customPlugins.html

const IMAGESCC_CUSTOM_PLUGIN = 'imagesCCcustomPlugin';
const EMOJI_CUSTOM_PLUGIN = 'emojiCustomPlugin';

const initImagesCC = onImagesButtonClick => ({
  name: IMAGESCC_CUSTOM_PLUGIN,
  display: 'command',
  add: () => {},
  action: onImagesButtonClick,
});

const initEmojiPicker = onEmojiButtonClick => ({
  name: EMOJI_CUSTOM_PLUGIN,
  display: 'command',
  add: () => {},
  action: onEmojiButtonClick,
});

export default {
  IMAGESCC_CUSTOM_PLUGIN,
  EMOJI_CUSTOM_PLUGIN,
  initImagesCC,
  initEmojiPicker,
};
