const RSSFormatError = (data) => {
  const error = new Error(data);
  error.message = 'Ресурс не содержит валидный RSS';
  error.name = 'RSSFormatError';

  throw error;
};

const parsePost = (post) => {
  const title = post.querySelector('title').textContent;
  const description = post.querySelector('description').textContent;
  const link = post.querySelector('link').textContent;

  return { title, link, description };
};

export default (data) => {
  const parser = new DOMParser();

  const document = parser.parseFromString(data, 'text/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) throw new RSSFormatError(data);

  const title = document.querySelector('title').textContent;
  const description = document.querySelector('description').textContent;
  const link = document.querySelector('link').textContent;
  const posts = document.querySelectorAll('item');
  const postsData = Array.from(posts).map(parsePost);

  return {
    title, description, link, postsData,
  };
};
