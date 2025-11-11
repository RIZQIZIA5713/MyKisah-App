import {
  generateLoaderAbsoluteTemplate,
  generateStoryDetailTemplate,
  generateStoryDetailErrorTemplate,
  generateRemoveStoryButtonTemplate,
  generateSaveStoryButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import StoryDetailPresenter from './story-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import * as MyKisahAPI from '../../data/api';
import Database from '../../data/database';

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: MyKisahAPI,
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailTemplate({
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
      placeName: story.placeName,
    });

    // Carousel (jika banyak foto di masa depan)
    const imageElement = document.getElementById('story-detail-photo');
    if (imageElement) createCarousel(imageElement);

    // Map
    await this.#presenter.showStoryDetailMap();
    if (this.#map && story.lat && story.lon) {
      const storyCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.name };

      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    this.#presenter.showSaveButton();
  }

  populateStoryDetailError(message) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }

  removeFromBookmarkFailed(message) {
    alert(message);
  }

  showStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}
