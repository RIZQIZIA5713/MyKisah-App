export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();

    try {
      const response = await this.#model.loginUser({ email, password });

      if (!response.ok || response.error) {
        console.error('getLogin: response:', response);
        this.#view.loginFailed(response.message || 'Login gagal. Periksa kembali email dan password.');
        return;
      }

      const { token } = response.loginResult;
      this.#authModel.putAccessToken(token);

      this.#view.loginSuccessfully(response.message, response.loginResult);
    } catch (error) {
      console.error('getLogin: error:', error);
      this.#view.loginFailed('Terjadi kesalahan jaringan atau server. Silakan coba lagi.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
