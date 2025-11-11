import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import * as MyKisahAPI from '../../data/api';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Daftar Story</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: MyKisahAPI,
    });

    await this.#presenter.initialStories();
  }

  populateStoriesList(message, stories) {
    if (!stories || stories.length === 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((acc, story) => {
      return acc.concat(generateStoryItemTemplate(story));
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
