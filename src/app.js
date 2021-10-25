import onChange from 'on-change';
import i18next from 'i18next';
import { setLocale } from 'yup';
import ru from './locale/ru.js';
import * as view from './view.js';

import loadDataFromUrl from './loadRSS.js';
import parse from './parser.js';
import validateUrl from './validation';

export default () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => 'errors.url_exist',
      },
      string: {
        url: () => 'errors.format_url_invalid',
      },
    });

    const state = {
      feeds: [],
      posts: [],
      addingProcess: {
        state: 'filling',
        error: null,
        validationState: 'valid',
      },
    };

    const elements = {
      button: document.querySelector('button'),
      input: document.querySelector('#url-input'),
      form: document.querySelector('.rss-form'),
      feedback: document.querySelector('.feedback'),
    };

    const watcherState = onChange(state, () => {
      switch (watcherState.addingProcess.state) {
        case 'filling': {
          view.unlockForm(elements);
          break;
        }
        case 'processing': {
          view.blockForm(elements);
          break;
        }
        case 'processed': {
          if (state.addingProcess.validationState === 'valid') {
            view.renderSuccess(i18nextInstance, elements);
            view.clearForm(elements);
          } else {
            view.renderError(i18nextInstance, state, elements);
          }

          view.unlockForm(elements);
          break;
        }
        default: {
          console.log('default');
        }
      }
    });

    elements.form.addEventListener('submit', (event) => {
      event.preventDefault();

      watcherState.addingProcess.state = 'processing';
      const inputUrl = elements.input.value;

      validateUrl(inputUrl, state.feeds)
        .then((url) => loadDataFromUrl(url))
        .then((response) => parse(response))
        .then((data) => {
          watcherState.feeds = [...watcherState.feeds, inputUrl];
          watcherState.addingProcess.validationState = 'valid';

          console.log(data);
        })
        .catch((error) => {
          if (error.name === 'RSSFormatError') {
            watcherState.addingProcess.error = 'errors.rss_invalid';
          } else {
            watcherState.addingProcess.error = error.message;
          }

          watcherState.addingProcess.validationState = 'invalid';
        })
        .finally(() => {
          console.log('Все равно выполнить!');
          watcherState.addingProcess.state = 'processed';
          watcherState.addingProcess.state = 'filling';
        });
    });
  });
};
