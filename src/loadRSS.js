import axios from 'axios';

const proxy = 'https://hexlet-allorigins.herokuapp.com/get';

export default (url) => {
  const proxyUrl = new URL(proxy);

  proxyUrl.searchParams.set('disableCache', true);
  proxyUrl.searchParams.set('url', url);

  return axios.get(proxyUrl)
    .then((response) => response.data.contents)
    .catch((error) => {
      throw error;
    });
};
