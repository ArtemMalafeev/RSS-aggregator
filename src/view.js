const unlockForm = (elements) => {
  const { button, input } = elements;

  button.disabled = false;
  input.disabled = false;
  input.focus();
};

const clearForm = ({ form }) => {
  form.reset();
};

const blockForm = (elements) => {
  const { button, input } = elements;

  button.disabled = true;
  input.disabled = true;
};

const renderSuccess = (i18next, elements) => {
  const { feedback, input } = elements;

  feedback.classList.replace('text-danger', 'text-success');
  input.classList.remove('is-invalid');
  feedback.textContent = i18next.t('successfully');
};

const renderError = (i18next, state, elements) => {
  const { feedback, input } = elements;

  feedback.classList.replace('text-success', 'text-danger');
  input.classList.add('is-invalid');
  console.log(state.addingProcess.error.key);
  feedback.textContent = i18next.t(state.addingProcess.error);
};

export {
  unlockForm,
  blockForm,
  clearForm,
  renderSuccess,
  renderError,
};
