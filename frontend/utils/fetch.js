import fetchDefaults from 'fetch-defaults';

// import API url here
const API_URL = '';

// leave empty in dev mode for CORS request
let BASE_URL = '';

if (process.env.NODE_ENV === 'production') {
  BASE_URL = API_URL;
}

const getToken = () => {
  try {
    const token = localStorage.accessToken;

    if (!token) return '';

    return `Bearer ${token}`;
  } catch (err) {
    return '';
  }
};

const configPost = () => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: getToken()
  }
});

const configPut = () => ({
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: getToken()
  }
});

const configGet = () => ({
  headers: {
    Authorization: getToken()
  }
});

const configDelete = () => ({
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    Authorization: getToken()
  }
});

export const errorHandler = (res) => {
  if (!res.ok && res.status >= 400) {
    throw new Error(res.status);
  }

  return res;
};

export const get = (...params) =>
  fetchDefaults(fetch, BASE_URL, configGet())(...params);

export const post = (...params) =>
  fetchDefaults(fetch, BASE_URL, configPost())(...params);

export const del = (...params) =>
  fetchDefaults(fetch, BASE_URL, configDelete())(...params);

export const put = (...params) =>
  fetchDefaults(fetch, BASE_URL, configPut())(...params);

export default fetchDefaults(fetch, BASE_URL);
