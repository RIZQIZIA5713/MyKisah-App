import { storyMapper } from '../../data/api-mapper';

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialStories() {
    this.#view.showLoading();

    try {
      const response = await this.#model.getAllStories();

      if (!response.ok || response.error) {
        console.error('initialStories: response:', response);
        this.#view.populateStoriesListError(response.message || 'Gagal memuat daftar story.');
        return;
      }

      let stories = response.listStory || [];
      console.log('Fetched stories:', stories);

      stories = await Promise.all(stories.map(async (story) => {
        try {
          return await storyMapper(story);
        } catch (error) {
          console.error('storyMapper error:', error);
          return { ...story, placeName: 'Lokasi tidak diketahui' };
        }
      }));

      this.#view.populateStoriesList(response.message, stories);
    } catch (error) {
      console.error('initialStories: error:', error);
      this.#view.populateStoriesListError(error.message || 'Terjadi kesalahan jaringan.');
    } finally {
      this.#view.hideLoading();
    }
  }
}
