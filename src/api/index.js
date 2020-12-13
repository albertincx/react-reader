import { TOKEN } from './config';
import Toastify from 'toastify-js';

const TOAST_CLASS = '.toastify.info.toastify-right.toastify-top';
function showToast(text) {
  const toast = {
    text,
    backgroundColor: 'red',
    className: 'info',
    close: true,
  };

  const el = document.querySelector(TOAST_CLASS);
  if (el) {
    return;
  }
  Toastify(toast).showToast();
}

function handleApiErrors(response) {
  if (!response) {
    let text = 'Сбой соединения';
    showToast(text);
    return;
  }
  if (response.ok) return response;
  let text = response.message || response.statusText;
  if (response.status === 404) {
    showToast('Данные не найдены');
    return;
  }
  if (response.status === 401) {
    showToast('Необходимо авторизоваться');
    return;
  }
  if (text.match('Failed to fetch')) {
    showToast('Не возможно подключиться к серверу');
    return;
  }
  if (response.code !== 200) {
    if (response.status >= 400) {
      return response.text().then(msg => {
        try {
          let s = JSON.parse(msg);
          msg = s.message;
        } catch (e) {
        }
        showToast((msg || {}).message || msg || 'Произошла ошибка');
      });
    }
    if (response.errors) {
      const [first] = response.errors;
      if (first && first.messages) [text] = first.messages;
    }
  }
  let nText = text;
  if (nText.match(/failed to fetch|gateway/i)) {
    nText = 'Сервис временно недоступен, мы уже решаем проблему';
    text = nText;
  }
  showToast(nText);
  throw new Error(text);
}
function getOptions(endPoint, data = {}) {
  const options = data;
  let requestUrl = /http/.test(endPoint) ? endPoint : `${endPoint}`;
  if (data.url) {
    requestUrl = data.url;
  }
  const headers = { Authorization: `Bearer ${TOKEN}` };
  const { formData } = options;
  if (!options.method && (formData || options.data || options.next)) {
    options.method = 'POST';
  }

  if (!formData && (options.data || options.json)) {
    headers['Content-Type'] = 'application/json';
    headers.Accept = 'application/json';
  }
  options.headers = headers;
  if (options.data) {
    options.body = JSON.stringify(options.data);
  }
  if (formData) {
    options.body = formData;
  }
  if (/:elemId/.test(requestUrl)) {
    let id = options.data && options.data.id ? options.data.id : options.id;
    if (id === 'new' || typeof id === 'undefined') {
      id = '';
    }
    requestUrl = requestUrl.replace(':elemId', id);
  }
  const sep = /\?/.test(requestUrl) ? '&' : '?';

  if (options.params) {
    if (options.params.task && window.location.search) {
      requestUrl += `&${window.location.search.replace('?', '')}`;
    }
  }
  return { options, requestUrl };
}

export default function request(url, data = {}, additionalOptions = {}) {
  const { options, requestUrl } = getOptions(url, data);

  return fetch(requestUrl, {...options, ...additionalOptions})
  .catch(handleApiErrors)
  .then(handleApiErrors)
  .then(response => {
    if (!response || response.status === 204 || response.status === 205) {
      return null;
    }
    if (data.text) {
      return response.text();
    }
    return response.json();
  });
}
