export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    this.#view.showSubmitLoadingButton();

    try {
      const response = await this.#model.registerUser({ name, email, password });

      if (!response.ok || response.error) {
        console.error('getRegistered: response:', response);
        this.#view.registeredFailed(response.message || 'Gagal mendaftar. Periksa kembali data Anda.');
        return;
      }

      this.#view.registeredSuccessfully(response.message);
    } catch (error) {
      console.error('getRegistered: error:', error);
      this.#view.registeredFailed('Terjadi kesalahan jaringan atau server. Silakan coba lagi.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
