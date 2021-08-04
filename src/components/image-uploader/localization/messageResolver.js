import defaultDictionary from './dictionary';
import { DEFAULT_ERROR_MSG_CODE } from '../const';

let dictionary = defaultDictionary;

export function setDictionary(dict) {
  dictionary = dict;
}

export function getMessage(code) {
  if (!dictionary) {
    return null;
  }

  const dictionaryItem = dictionary[code];

  return dictionaryItem || dictionary[DEFAULT_ERROR_MSG_CODE];
}
