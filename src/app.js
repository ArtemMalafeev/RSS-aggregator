import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import { setLocale } from 'yup';
import ru from './locale/ru.js';
import * as view from './view.js';

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
        notOneOf: () => ({ key: 'errors.url_exist' }),
      },
      string: {
        url: () => ({ key: 'errors.format_url_invalid' }),
      },
    });

    const state = {
      links: [],
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
      const inputValue = elements.input.value;

      const schema = yup.string().url().notOneOf(watcherState.links);
      schema.validate(inputValue)
        .then((link) => {
          watcherState.addingProcess.state = 'processing';
          watcherState.links = [...watcherState.links, link];
          watcherState.addingProcess.validationState = 'valid';
          watcherState.addingProcess.state = 'processed';
          watcherState.addingProcess.state = 'filling';
        })
        .catch((error) => {
          watcherState.addingProcess.state = 'processing';
          watcherState.addingProcess.error = error.message;
          watcherState.addingProcess.validationState = 'invalid';
          watcherState.addingProcess.state = 'processed';
          watcherState.addingProcess.state = 'filling';
        });
    });
  });
};
