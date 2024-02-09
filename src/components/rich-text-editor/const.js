import _ from 'lodash';
import sunEditorPlugins from 'suneditor/src/plugins';
import { IMAGESCC_CUSTOM_PLUGIN } from './customPlugins';

export function resolveEditorOptions(customPlugins) {
  const attachmentsButtonList = ['link', 'video', 'image'];
  const resolvedPlugins = [...customPlugins];

  _.forEach(sunEditorPlugins, plugin => {
    const item = _.find(customPlugins, { name: plugin.name });
    if (!item) {
      resolvedPlugins.push(plugin);
    }
  });

  const imagesCCcustomPluginExist = _.find(customPlugins, {
    name: IMAGESCC_CUSTOM_PLUGIN,
  });
  if (imagesCCcustomPluginExist) {
    attachmentsButtonList.push({
      name: IMAGESCC_CUSTOM_PLUGIN,
      dataCommand: IMAGESCC_CUSTOM_PLUGIN,
      title: 'Image',
      dataDisplay: 'command',
      innerHTML:
        '<span class="font-icon se-icon se-icon-imagecreativecommons" style="font-size: 24px;"></span>',
    });
  }

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
      attachmentsButtonList,
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
