import { showFormattedDate } from './utils';

/* ========== LOADERS ========== */
export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

/* ========== NAVIGATION ========== */
export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" class="story-list-button" href="#/">Daftar Story</a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Cerita Tersimpan</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/new">Buat Story <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

/* ========== STORY LIST ========== */
export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>Tidak ada story yang tersedia</h2>
      <p>Belum ada story yang dibagikan. Ayo buat story pertamamu!</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Terjadi kesalahan saat memuat daftar story</h2>
      <p>${message ? message : 'Periksa koneksi internet Anda dan coba lagi.'}</p>
    </div>
  `;
}

/* ========== STORY ITEM ========== */
export function generateStoryItemTemplate({ id, name, description, photoUrl, createdAt, placeName}) {
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="Story dari ${name}">
      <div class="story-item__body">
        <h2 class="story-item__description">${description}</h2>
        
        <div class="story-item__info">
          <p id="story-name" class="story-item__title"><i class="fa-solid fa-user"></i> ${name}</p>
          <p class="story-item__createdat"><i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}</p>
          <p class="story-item__location"><i class="fas fa-map-marker-alt"></i> ${placeName}</p>
        </div>

        <a class="btn story-item__read-more" href="#/story/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

/* ========== STORY DETAIL ========== */
export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Terjadi kesalahan saat memuat detail story</h2>
      <p>${message ? message : 'Periksa koneksi internet Anda dan coba lagi.'}</p>
    </div>
  `;
}

export function generateStoryDetailTemplate({ name, description, photoUrl, createdAt, placeName }) {
  return `
  
  <div class="story-detail__photo__container">
  <img id="story-detail-photo" class="story-detail__photo" src="${photoUrl}" alt="${name}">
  </div>
  
  <div class="story-detail__info">
    <h1 class="story-detail__title">Detail Story</h1>
      <div class="story-detail__header">
        <h2 class="story-detail__username">${name}</h2>
        <p class="story-detail__date"><i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}</p>
        ${placeName ? `<p class="story-detail__place"><i class="fas fa-map"></i> ${placeName}</p>` : ''}
      </div>

      <div class="story-detail__caption">
        <p class="story-detail__description">${description}</p>
      </div>

      <div id="save-actions-container"></div>

      <div class="story-detail__map__container">
        <h3 class="story-detail__map__title">Lokasi</h3>
        <div id="map" class="story-detail__map"></div>
        <div id="map-loading-container"></div>
      </div>
    </div>
  `;
}

/* ========== PUSH NOTIFICATION BUTTONS ========== */
export function generateSubscribeButtonTemplate() {
  return `
  <button id="subscribe-button" class="btn subscribe-button">
    Aktifkan Notifikasi <i class="fas fa-bell"></i>
  </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
  <button id="unsubscribe-button" class="btn unsubscribe-button">
    Nonaktifkan Notifikasi <i class="fas fa-bell-slash"></i>
  </button>
  `;
}

/* ========== SAVE BUTTONS ========== */
export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="btn btn-transparent">
      Simpan cerita <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="btn btn-transparent">
      Buang cerita <i class="fas fa-bookmark"></i>
    </button>
  `;
}