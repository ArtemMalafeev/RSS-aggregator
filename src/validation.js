import * as yup from 'yup';

export default (url, feeds) => {
  const schema = yup
    .string()
    .url()
    .notOneOf(feeds);

  return schema
    .validate(url)
    .catch((error) => {
      throw error;
    });
};
