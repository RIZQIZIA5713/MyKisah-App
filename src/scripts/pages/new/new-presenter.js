export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, photo, lat, lon }) {
    this.#view.showSubmitLoadingButton();

    try {
      const data = {
        description,
        photo,
        lat,
        lon,
      };

      const response = await this.#model.addNewStory(data);

      if (!response.ok || response.error) {
        console.error('postNewStory: response:', response);
        this.#view.storeFailed(response.message || 'Gagal menambahkan story.');
        return;
      }

      this.#view.storeSuccessfully(response.message);
    } catch (error) {
      console.error('postNewStory: error:', error);
      this.#view.storeFailed(error.message || 'Terjadi kesalahan saat mengirim story.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
