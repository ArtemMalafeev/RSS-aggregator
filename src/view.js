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

const renderFeeds = (i18next, state, elements) => {
  const { feeds } = elements;
  feeds.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t('feeds');

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  const items = state.data.feeds.map((feed) => {
    const element = document.createElement('li');
    element.classList.add('list-group-item', 'border-0', 'border-end-0');

    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;

    element.append(title, description);

    return element;
  });

  list.append(...items);
  cardBody.append(cardTitle);
  card.append(cardBody);

  feeds.append(card, list);
};

const renderPosts = (i18next, state, elements) => {
  const { posts } = elements;

  posts.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18next.t('posts');

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  const items = state.data.posts.map((post) => {
    const element = document.createElement('li');
    element.classList.add('list-group-item', 'd-flex', 'justify-content-between',
      'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    link.setAttribute('href', post.link);
    link.classList.add('fw-bold');
    link.setAttribute('data-id', post.id);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = post.title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18next.t('viewButton');

    element.append(link, button);

    return element;
  });

  list.append(...items);
  cardBody.append(title);
  card.append(cardBody);

  posts.append(card, list);
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
  renderFeeds,
  renderPosts,
};
