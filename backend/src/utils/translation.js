const fs = require('fs');
const path = require('path');
const _set = require('lodash/set');
const _get = require('lodash/get');

const dirName = path.resolve('./public/translations');
const translations = {};

// this function is triggered after the translation JSON files are generated
const loadTranslationDataInMemory = () => {
  const fileNames = fs.readdirSync(dirName);
  fileNames.forEach((filename) => {
    if (filename.indexOf('.json') !== -1) {
      const content = fs.readFileSync(path.resolve(dirName, filename), 'utf-8');
      const key = filename.replace('.json', '');
      _set(translations, key, JSON.parse(content));
    }
  });
};

// TODO: keep this function up to date with front-end function
const translate = (key, language, options) => {
  const translationJSON = translations[language];

  const opts = options || {};

  let text = _get(translationJSON, key, 'NO TRANSLATION');

  if (opts.data) {
    // replace all { $varName } with the value from data.varName - regex finds both { $varName } and {$varName}
    text = text.replace(/{\s?\$(.*?)\s?}/gm, (match, capture) => {
      return opts.data[capture];
    });
  }

  return text;
};

module.exports = {
  translate,
  loadTranslationDataInMemory,
};
