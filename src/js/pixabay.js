import axios from 'axios';

export class Pixabay {
  #API_KEY = process.env.PARCEL_PIXABAY_API_KEY;
  #BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async getPopularPhotos() {
    try {
      const response = await axios.get(
        `${this.#BASE_URL}?key=${
          this.#API_KEY
        }&q=popular&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getPhotos() {
    try {
      const response = await axios.get(
        `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
          this.searchQuery
        }&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
