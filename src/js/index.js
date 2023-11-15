import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectBreed = document.querySelector('.breed-select');
const catCard = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

function createOptions(res) {
  const fragment = document.createDocumentFragment();
  res.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name;
    fragment.appendChild(option);
  });
  selectBreed.appendChild(fragment);
}

function createMarkup(cat) {
  return `
  <div class="cat-card">
    <img src="${cat.url}" alt="${cat.breeds[0].name}" class="cat-img">
  </div>
  <p class="cat-breed">${cat.breeds[0].name}</p>
  <p class="cat-description">${cat.breeds[0].description}</p>
  <p class="cat-temperament"><span>Temperament: </span>${cat.breeds[0].temperament}</p>
</div>
  `;
}

fetchBreeds()
  .then(res => {
    selectBreed.classList.remove('is-hidden');
    loader.classList.add('is-hidden');
    error.classList.add('is-hidden');
    createOptions(res);
  })
  .catch(err => {
    Notify.failure(`Error fetching breeds: ${err}`);
    error.classList.remove('is-hidden');
  });

selectBreed.addEventListener('change', () => {
  const chosenCat = selectBreed.value;

  loader.classList.remove('is-hidden');
  catCard.classList.add('is-hidden');

  fetchCatByBreed(chosenCat)
    .then(res => {
      catCard.classList.remove('is-hidden');
      catCard.innerHTML = createMarkup(res[0]);
    })
    .catch(err => {
      Notify.failure(`Error fetching cat information: ${err}`);
      error.classList.remove('is-hidden');
    })
    .finally(() => {
      loader.classList.add('is-hidden');
    });
});