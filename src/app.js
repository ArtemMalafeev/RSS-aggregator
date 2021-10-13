import onChange from 'on-change';
import * as yup from 'yup';

export default () => {
  const state = {
    links: [],
    addingProcess: {
      state: 'filling',
      errors: [],
      validationState: 'valid',
    },
  };

  const elements = {
    button: document.querySelector('button'),
    input: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
  };

  const watcherState = onChange(state, () => {
    switch (watcherState.addingProcess.state) {
      case 'filling': {
        console.log('filling');
        elements.form.reset();
        elements.input.focus();
        elements.button.disabled = false;
        break;
      }
      case 'sending': {
        console.log('sending');
        elements.button.disabled = true;
        break;
      }
      case 'finished': {
        console.log('finished');
        const pList = document.querySelectorAll('.feedback');
        pList.forEach((p) => p.remove());

        if (watcherState.addingProcess.validationState === 'invalid') {
          console.log('invalid');
          elements.input.classList.add('is-invalid');

          if (watcherState.addingProcess.errors.length > 0) {
            console.log('errors');
            watcherState.addingProcess.errors.forEach((error) => {
              const p = document.createElement('p');
              p.className = 'feedback m-0 position-absolute small text-danger';
              p.textContent = error;
              elements.form.closest('div').append(p);
            });
          }
        } else {
          console.log('valid');
          const p = document.createElement('p');
          p.className = 'feedback m-0 position-absolute small text-success';
          p.textContent = 'RSS успешно добавлен';
          elements.form.closest('div').append(p);
        }
        break;
      }
      default: {
        console.log('default');
      }
    }
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const link = elements.form.elements.url.value;
    const schema = yup.string().url().notOneOf(watcherState.links);
    schema.validate(link)
      .then((data) => {
        console.log(data);
        watcherState.addingProcess.state = 'sending';
        watcherState.addingProcess.errors = [];
        watcherState.links = [...watcherState.links, data];
        watcherState.addingProcess.validationState = 'valid';
        watcherState.addingProcess.state = 'finished';
        watcherState.addingProcess.state = 'filling';
      })
      .catch((error) => {
        watcherState.addingProcess.state = 'filling';
        watcherState.addingProcess.errors = error.errors;
        watcherState.addingProcess.validationState = 'invalid';
        watcherState.addingProcess.state = 'finished';
        watcherState.addingProcess.state = 'filling';
      });
  });
};
