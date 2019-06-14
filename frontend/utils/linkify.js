import sanitizeHtml from 'sanitize-html';

const linkify = (inputText) => {
  let replacedText = sanitizeHtml(inputText, {
    allowedTags: [],
    allowedAttributes: [],
  });

  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = replacedText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  // URLs starting with www. (without // before it, or it'd re-link the ones done above)
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  // Change email addresses to mailto:: links
  const replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
};

export default linkify;
