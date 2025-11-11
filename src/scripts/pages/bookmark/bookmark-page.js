import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Daftar Story Tersimpan</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initialStories();
  }

  populateBookmarkedStoriesList(message, stories) {
    if (!stories || stories.length === 0) {
      this.populateBookmarkedStoriesListEmpty();
      return;
    }

    const html = stories.reduce((acc, story) => {
      return acc.concat(generateStoryItemTemplate(story));
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateBookmarkedStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateBookmarkedStoriesListError(message) {
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
