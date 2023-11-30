import { fetchBreeds, fetchCatByBreed, displayError } from './cat-api.js';
import SlimSelect from 'slim-select';

let slimSelect = null;
let errorElement = null;
let loader = null;

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
  errorElement = document.querySelector('.error');
  loader = document.querySelector('.loader');
  const breedSelect = document.querySelector('.breed-select');
  const catInfo = document.querySelector('.cat-info');

  loader.style.display = 'block';

  fetchBreeds(errorElement, loader)
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

      breedSelect.style.display = 'block';
      loader.style.display = 'none';
      errorElement.style.display = 'none';
    })
    .catch(() => {
      displayError(errorElement, loader);
    });

  breedSelect.addEventListener('change', event => {
    loader.style.display = 'block';
    errorElement.style.display = 'none';
    catInfo.innerHTML = '';

    fetchCatByBreed(event.target.value, errorElement, loader)
      .then(cats => {
        const markup = createMarkup(cats);
        catInfo.innerHTML = markup;
        loader.style.display = 'none';
      })
      .catch(() => {
        displayError(errorElement, loader);
      });
  });
});
