import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_BGHVXS9HRJW6rgW9IQYtalpwpiOTRRwNlGFWeCidmk1cMnZOsP2CCA8I8oCDINU9';

export const displayError = (errorElement, loader) => {
  if (errorElement && loader) {
    errorElement.textContent =
      'Oops! Something went wrong! Try reloading the page!';
    errorElement.style.display = 'block';
    loader.style.display = 'none';
  } else {
    console.error('Error element or loader is not defined.');
  }
};

export const fetchBreeds = (errorElement, loader) => {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      if (!response.data || response.data.length === 0) {
        throw new Error('No breeds data found');
      }
      return response.data;
    })
    .catch(error => {
      displayError(errorElement, loader);
      console.error(error);
    });
};

export const fetchCatByBreed = (breedId, errorElement, loader) => {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      if (!response.data || response.data.length === 0) {
        throw new Error(`No cat found for breed ID: ${breedId}`);
      }
      return response.data;
    })
    .catch(error => {
      displayError(errorElement, loader);
      console.error(error);
    });
};
