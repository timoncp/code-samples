const getItem = (key) => {
  try {
    const dataFromLs = window.localStorage.getItem(key);

    if (dataFromLs === null) return undefined;

    return JSON.parse(dataFromLs);
  } catch (e) {
    return undefined;
  }
};

const setItem = (key, data) => {
  try {
    const stringifiedData = JSON.stringify(data);

    return window.localStorage.setItem(key, stringifiedData);
  } catch (e) {
    return undefined;
  }
};

export default {
  getItem,
  setItem,
};
