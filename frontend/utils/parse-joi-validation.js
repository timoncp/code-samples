const parseValidation = (errors) => {
  return errors.map((error) => {
    error.field.splice(0, 1);
    const field = error.field.join('.');

    // The message looks like ["source" VALIDATON_ERROR], so after the split we take the last item of the array
    const splitMessage = error.messages[error.messages.length - 1].split('" ');
    const message = splitMessage[splitMessage.length - 1];

    return {
      message,
      field,
    };
  });
};

export default parseValidation;
