import { storyMapper } from '../../data/api-mapper';

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialStories() {
    this.#view.showLoading();

    try {
      const stories = await this.#model.getAllStories();
      console.log('initialStories: response:', stories);

      if (!stories || stories.length === 0) {
        this.#view.populateBookmarkedStoriesListEmpty();
        return;
      }

      const mappedStories = await Promise.all(
        stories.map(async (story) => {
          try {
            return await storyMapper(story);
          } catch (error) {
            console.error('storyMapper error:', error);
            return { ...story, placeName: 'Lokasi tidak diketahui' };
          }
        })
      );

      this.#view.populateBookmarkedStoriesList('Berhasil memuat daftar story.', mappedStories);
    } catch (error) {
      console.error('initialStories: error:', error);
      this.#view.populateBookmarkedStoriesListError(error.message || 'Terjadi kesalahan.');
    } finally {
      this.#view.hideLoading();
    }
  }
}
