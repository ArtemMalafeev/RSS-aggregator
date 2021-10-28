const unlockForm = ({ button, input }) => {
  button.disabled = false;
  input.disabled = false;
  input.focus();
};

const clearForm = ({ form }) => {
  form.reset();
};

const blockForm = ({ button, input }) => {
  button.disabled = true;
  input.disabled = true;
};

const renderSuccess = (i18next, { feedback, input }) => {
  feedback.classList.replace('text-danger', 'text-success');
  feedback.textContent = i18next.t('successfully');
  input.classList.remove('is-invalid');
};

const renderFeeds = (i18next, state, { feeds }) => {
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

const renderPosts = (i18next, state, { posts }) => {
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
    link.href = post.link;

    link.classList.add('fw-bold');
    if (state.uiState.readPostsId.has(post.id)) {
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal', 'link-secondary');
    }

    link.dataset.id = post.id;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = post.title;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18next.t('viewButton');

    element.append(link, button);

    return element;
  });

  list.append(...items);
  cardBody.append(title);
  card.append(cardBody);

  posts.append(card, list);
};

const renderModal = (state, { modal }) => {
  const post = _.find(state.data.posts, { id: state.uiState.selectedPostId });
  
  modal.querySelector('.modal-title').textContent = post.title;
  modal.querySelector('.modal-body').textContent = post.description;
  modal.querySelector('a').href = post.link;
};

const renderError = (i18next, state, { feedback, input }) => {
  feedback.classList.replace('text-success', 'text-danger');
  feedback.textContent = i18next.t(state.addingProcess.error);
  input.classList.add('is-invalid');
};

export {
  unlockForm,
  blockForm,
  clearForm,
  renderSuccess,
  renderError,
  renderFeeds,
  renderPosts,
  renderModal,
};
