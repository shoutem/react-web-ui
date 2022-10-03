import _ from 'lodash';
import sunEditorPlugins from 'suneditor/src/plugins'

export function resolveEditorOptions(customPlugins) {
  const resolvedPlugins = [...customPlugins];

  _.forEach(sunEditorPlugins, plugin => {
    const item = _.find(customPlugins, { name: plugin.name});
    if (!item) {
      resolvedPlugins.push(plugin);
    }
  })

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
        'image',
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
    ],
  };
}
