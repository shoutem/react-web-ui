import _ from 'lodash';
import customPlugins from './customPlugins';

export function resolveEditorOptions(allPlugins) {
  const resolvedPlugins = _.map(allPlugins, (plugin) => {
    if (
      plugin.name === customPlugins.IMAGESCC_CUSTOM_PLUGIN ||
      plugin.name === customPlugins.EMOJI_CUSTOM_PLUGIN
    ) {
      return null;
    }

    return plugin.definition;
  });
  const resolvedCustomPluginButtons = _.map(allPlugins, (plugin) => {
    if (
      plugin.name === customPlugins.IMAGESCC_CUSTOM_PLUGIN ||
      plugin.name === customPlugins.EMOJI_CUSTOM_PLUGIN
    ) {
      return null;
    }

    return plugin.toolbarComponent;
  });

  return {
    plugins: resolvedPlugins,
    height: 300,
    defaultTag: 'div',
    textTags: {
      strike: 's',
    },
    imageRotation: false,
    mediaAutoSelect: false,
    videoResizing: false,
    formats: ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    imageFileInput: false,
    linkProtocol: 'https://',
    buttonList: [
      ['undo', 'redo', 'removeFormat'],
      ['-right', 'fullScreen', 'codeView'],
      '/',
      [
        'fontSize',
        'formatBlock',
        'bold',
        'underline',
        'italic',
        'strike',
        'fontColor',
        'hiliteColor',
        'outdent',
        'indent',
      ],
      ['align', 'list', 'table'],
      [
        'link',
        'video',
        {
          name: 'imagesCCcustomPlugin',
          dataCommand: 'imagesCCcustomPlugin',
          title: 'Image',
          dataDisplay: 'command',
          innerHTML:
            '<span class="font-icon se-icon se-icon-imagecreativecommons" style="font-size: 24px;"></span>',
        },
      ],
      [
        {
          name: 'emojiCustomPlugin',
          dataCommand: 'emojiCustomPlugin',
          buttonClass: '',
          title: 'Emoji',
          dataDisplay: 'command',
          innerHTML:
            '<span class="font-icon se-icon se-icon-emoticon" style="font-size: 24px;"></span>',
        },
      ],
      ...resolvedCustomPluginButtons,
    ],
  };
}
