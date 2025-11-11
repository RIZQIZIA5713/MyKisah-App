import RegisterPresenter from './register-presenter';
import * as MyKisahAPI from '../../../data/api';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container">
        <div class="register-form-container">
          <h1 class="register__title">Daftar ke Story App</h1>

          <form id="register-form" class="register-form">
            <div class="form-control">
              <label for="name-input" class="register-form__name-title">Nama Lengkap</label>

              <div class="register-form__input-container">
                <input  id="name-input"  type="text"  name="name"  placeholder="Masukkan nama lengkap Anda" required>
              </div>
            </div>

            <div class="form-control">
              <label for="email-input" class="register-form__email-title">Email</label>

              <div class="register-form__input-container">
                <input  id="email-input"  type="email"  name="email"  placeholder="Contoh: nama@email.com" required>
              </div>
            </div>

            <div class="form-control">
              <label for="password-input" class="register-form__password-title">Password</label>

              <div class="register-form__input-container">
                <input  id="password-input"  type="password"  name="password"  placeholder="Masukkan password minimal 8 karakter" minlength="8" required>
              </div>
            </div>

            <div class="form-buttons register-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Daftar</button>
              </div>
              <p class="register-form__already-have-account">
                Sudah punya akun? <a href="#/login">Masuk</a>
              </p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: MyKisahAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    console.log('Registrasi berhasil:', message);
    alert('Akun berhasil dibuat! Silakan login.');
    location.hash = '/login';
  }

  registeredFailed(message) {
    alert(`Gagal mendaftar: ${message}`);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Mendaftar...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Daftar</button>
    `;
  }
}
