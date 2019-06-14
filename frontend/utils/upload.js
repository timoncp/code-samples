const blobToBase64 = (blob, callback) => {
  const reader = new window.FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    const base64 = dataUrl.split(',')[1];
    callback(base64);
  };
  reader.readAsDataURL(blob);
};

export default blobToBase64;
