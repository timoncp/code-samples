import React from 'react';

const translate = (key, options = {}) => {
  if (!store) {
    return '';
  }

  const opts = { ...options };

  if (!opts.format) opts.format = 'string';

  const state = store.getState();

  let text = state.translationTexts[key] || 'NO TRANSLATION';

  if (opts.data) {
    // replace all { $varName } with the value from data.varName - regex finds both { $varName } and {$varName}
    text = text.replace(/{\s?\$(.*?)\s?}/gm, (match, capture) => {
      return opts.data[capture];
    });
  }

  if (opts.format === 'html') {
    const markup = { __html: text };

    return (
      <span style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={markup} />
    );
  }

  if (opts.format === 'string') return text;

  return '';
};

export default translate;
