import NewPresenter from './new-presenter';
import { convertBase64ToBlob } from '../../utils';
import * as MyKisahAPI from '../../data/api';
import { generateLoaderAbsoluteTemplate } from '../../templates';
import Camera from '../../utils/camera';
import Map from '../../utils/map';

export default class NewPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenPhotos = [];
  #map = null;

  async render() {
    return `  
      <section class="container">
        <div class="new-form__container">
          <div class="new-story__header">
            <h1 class="new-story__header__title">Buat Story Baru</h1>
            <p class="new-story__header__description">Unggah foto dan tuliskan deskripsi cerita Anda.<br></p>
          </div>

          <form id="new-form" class="new-form">
            <div class="form-control">
              <label for="description-input" class="new-form__description__title">Deskripsi</label>
              <div class="new-form__description__container">
                <textarea id="description-input" name="description" placeholder="Tulis cerita atau pengalaman Anda di sini..." required></textarea>
              </div>
            </div>

            <div class="form-control">
              <label for="photo-input" class="new-form__photo__title">Foto Story</label>
              <div id="photo-more-info">Unggah atau ambil gambar dari kamera (maks 1MB).</div>

              <div class="new-form__photo__container">
                <div class="new-form__photo__buttons">
                  <button id="photo-input-button" class="btn btn-outline" type="button">Pilih Foto</button>
                  <input id="photo-input" name="photo" type="file" accept="image/*" hidden>
                  <button id="open-camera-button" class="btn btn-outline" type="button">Buka Kamera</button>
                </div>

                <div id="camera-container" class="new-form__camera__container">
                  <video id="camera-video" class="new-form__camera__video">Video stream not available.</video>
                  <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>

                  <div class="new-form__camera__tools">
                    <select id="camera-select"></select>
                    <div class="new-form__camera__tools_buttons">
                      <button id="camera-take-button" class="btn" type="button">Ambil Gambar</button>
                    </div>
                  </div>
                </div>

                <ul id="photos-taken-list" class="new-form__photo__outputs"></ul>
              </div>
            </div>

            <div class="form-control">
              <div class="new-form__location__title">Lokasi (Opsional)</div>

              <div class="new-form__location__container">
                <div class="new-form__location__map__container">
                  <div id="map" class="new-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="new-form__location__lat-lng">
                  <div class="new-form__location__lat">
                    <label for="lat">Latitude</label>
                    <input type="number" name="lat" step="any" placeholder="-6.175389">
                  </div>
                  <div class="new-form__location__lng">
                    <label for="lon">Longitude</label>
                    <input type="number" name="lon" step="any" placeholder="106.827139">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-buttons">
              <span id="submit-button-container">
                <button class="btn" type="submit">Kirim Story</button>
              </span>
              <a class="btn btn-outline" href="#/">Batal</a>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: MyKisahAPI,
    });
    this.#takenPhotos = [];

    this.#presenter.showNewFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('new-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem('description').value,
        photo: this.#takenPhotos[0]?.blob || this.#form.elements.namedItem('photo').files[0],
        lat: this.#form.elements.namedItem('lat').value || null,
        lon: this.#form.elements.namedItem('lon').value || null,
      };
      await this.#presenter.postNewStory(data);
    });

    document.getElementById('photo-input').addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) await this.#addTakenPhoto(file);
      await this.#populateTakenPhotos();
    });

    document.getElementById('photo-input-button').addEventListener('click', () => {
      this.#form.elements.namedItem('photo').click();
    });

    const cameraContainer = document.getElementById('camera-container');
    document
      .getElementById('open-camera-button')
      .addEventListener('click', async (event) => {
        cameraContainer.classList.toggle('open');
        this.#isCameraOpen = cameraContainer.classList.contains('open');

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = 'Tutup Kamera';
          this.#setupCamera();
          await this.#camera.launch();
          return;
        }

        event.currentTarget.textContent = 'Buka Kamera';
        this.#camera.stop();
      });
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();
    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: 'true' },
    );

    draggableMarker.addEventListener('move', (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener('click', (event) => {
      draggableMarker.setLatLng(event.latlng);
      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('lat').value = latitude;
    this.#form.elements.namedItem('lon').value = longitude;
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById('camera-video'),
        cameraSelect: document.getElementById('camera-select'),
        canvas: document.getElementById('camera-canvas'),
      });
    }

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPhoto(image);
      await this.#populateTakenPhotos();
    });
  }

  async #addTakenPhoto(image) {
    let blob = image;

    if (typeof image === 'string') {
      blob = await convertBase64ToBlob(image, 'image/png');
    }

    const newPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenPhotos = [...this.#takenPhotos, newPhoto];
  }

  async #populateTakenPhotos() {
    const html = this.#takenPhotos.reduce((accumulator, photo, currentIndex) => {
      const imageUrl = URL.createObjectURL(photo.blob);
      return accumulator.concat(`
        <li class="new-form__photo__outputs-item">
          <button type="button" data-deletephotoid="${photo.id}" class="new-form__photo__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="Foto story ke-${currentIndex + 1}">
          </button>
        </li>
      `);
    }, '');

    document.getElementById('photos-taken-list').innerHTML = html;

    document.querySelectorAll('button[data-deletephotoid]').forEach((button) =>
      button.addEventListener('click', (event) => {
        const photoId = event.currentTarget.dataset.deletephotoid;
        const deleted = this.#removePhoto(photoId);
        if (!deleted) console.log(`Foto dengan id ${photoId} tidak ditemukan.`);
        this.#populateTakenPhotos();
      }),
    );
  }

  #removePhoto(id) {
    const selectedPhoto = this.#takenPhotos.find((photo) => photo.id == id);
    if (!selectedPhoto) return null;

    this.#takenPhotos = this.#takenPhotos.filter((photo) => photo.id != selectedPhoto.id);
    return selectedPhoto;
  }

  storeSuccessfully(message) {
    console.log(message);
    alert('Story berhasil diunggah!');
    this.clearForm();
    location.hash = '/';
  }

  storeFailed(message) {
    alert(message || 'Gagal mengunggah story.');
  }

  clearForm() {
    this.#form.reset();
    this.#takenPhotos = [];
    document.getElementById('photos-taken-list').innerHTML = '';
  }

  showMapLoading() {
    const mapLoading = document.getElementById('map-loading-container');
    if (!mapLoading) return; // <- prevent null access
    mapLoading.innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    const mapLoading = document.getElementById('map-loading-container');
    if (!mapLoading) return; // <- prevent null access
    mapLoading.innerHTML = '';
  }


  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Mengirim...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Kirim Story</button>
    `;
  }
}
