import axios from 'axios';
import SlimSelect from 'slim-select';

let slimSelect = null;

axios.defaults.headers.common['x-api-key'] =
  'live_BGHVXS9HRJW6rgW9IQYtalpwpiOTRRwNlGFWeCidmk1cMnZOsP2CCA8I8oCDINU9';

function displayError() {
  errorElement.textContent =
    'Oops! Something went wrong! Try reloading the page!';
  errorElement.style.display = 'block';
  breedSelect.style.display = 'none';
  loader.style.display = 'none';
}

const fetchBreeds = () => {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      displayError();
      console.error(error);
    });
};

const fetchCatByBreed = breedId => {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .catch(error => {
      displayError();
      console.error(error);
    });
};

function createMarkup(cats) {
  return cats
    .map(cat => {
      const { name, description, temperament } = cat.breeds[0];
      return `
        <div class="cat-card">
          <img class="cat-img" src="${cat.url}" alt="${name}">
          <div>
            <h2>${name}</h2>
            <p><span class="text-bold">Description:</span> ${description}</p>
            <p><span class="text-bold">Temperament:</span> ${temperament}</p>
          </div>
        </div>
      `;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const errorElement = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  errorElement.style.display = 'none';

  fetchBreeds()
    .then(breeds => {
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });

      slimSelect = new SlimSelect({
        select: breedSelect,
      });

      loader.style.display = 'none';
    })
    .catch(() => displayError());

  breedSelect.addEventListener('change', event => {
    loader.style.display = 'block';
    catInfo.innerHTML = '';
    fetchCatByBreed(event.target.value)
      .then(cats => {
        const markup = createMarkup(cats);
        catInfo.innerHTML = markup;
        loader.style.display = 'none';
      })
      .catch(() => displayError());
  });
});
