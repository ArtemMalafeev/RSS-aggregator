import onChange from 'on-change';
import i18next from 'i18next';
import { setLocale } from 'yup';
import _ from 'lodash';
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
      addingProcess: {
        state: 'filling',
        error: null,
        validationState: 'valid',
      },
      data: {
        feeds: [],
        posts: [],
      },
    };

    const elements = {
      button: document.querySelector('button'),
      input: document.querySelector('#url-input'),
      form: document.querySelector('.rss-form'),
      feedback: document.querySelector('.feedback'),
      feeds: document.querySelector('.feeds'),
      posts: document.querySelector('.posts'),
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
            view.renderFeeds(i18nextInstance, state, elements);
            view.renderPosts(i18nextInstance, state, elements);
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
      const currentUrls = watcherState.data.feeds.map((feed) => feed.RSSlink);

      validateUrl(inputUrl, currentUrls)
        .then((url) => loadDataFromUrl(url))
        .then((response) => parse(response))
        .then(({
          title, description, link, postsData,
        }) => {
          const id = _.uniqueId();

          watcherState.data.feeds.push({
            id, title, description, link, RSSlink: inputUrl,
          });

          postsData.forEach((post) => {
            watcherState.data.posts.push({
              idFeed: id, id: _.uniqueId(), title: post.title, link: post.link,
            });
          });

          watcherState.addingProcess.validationState = 'valid';
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
          // runTimer();
          watcherState.addingProcess.state = 'processed';
          watcherState.addingProcess.state = 'filling';
        });
    });
  });
};
