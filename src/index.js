import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');

const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchInputEl.addEventListener('input', debounce(onInputRender
   , DEBOUNCE_DELAY));


function onInputRender() {
   clearMarkup();
   if (searchInputEl.value !== '') {
      const trimedValue = searchInputEl.value.trim();
      fetchCountries(trimedValue).then(countries => {
         if (countries.length === 0) {
            Notiflix.Notify.failure("Oops, there is no country with that name");
         }
         if (countries.length > 10) {
            clearMarkup();
            Notiflix.Notify.info(
               'Too many matches found. Please enter a more specific name.'
            );
         }
         if (countries.length <= 10 && countries.length >= 2) {
            clearMarkup();
            renderCountriesList(countries);
         }

         if (countries.length === 1) {
            clearMarkup();
            renderCountryInfo(countries);
         }
      })
   }
}

function renderCountriesList(countries) {
   const markup = countries
      .map(country => {
         return `<li style = "display: flex; margin-bottom: 10px">
          <img src="${country.flags.svg}" width = '40' height = '30'>
          <p style = "margin-left: 15px; font-size: 20px; font-weight: 600;">${country.name.official}</p>
         </li>`;
      })
      .join('');
   countryListEl.innerHTML = markup;
}

function renderCountryInfo(countries) {
   const markup = countries
      .map(country => {
         return `<ul>
      <li style = "display: flex; align-items: center;  margin-bottom: 20px">
         <img src="${country.flags.svg}" width = '30' height = '20'>
         <h1 style = "margin-left: 15px; font-size: 30px; font-weight: 700;">${country.name.official}</h1>
         </li>
         <li style = "margin-bottom: 5px;">
         <p style = "font-size: 20px; font-weight: 600;">Capital: <span style = "font-weight: 400">${country.capital}</span></p>
         </li>
         <li>
          <p style = "font-size: 20px; font-weight: 600;">Population: <span style = "font-weight: 400">${country.population}</span></p>
         </li>
         <li>
          <p style = "font-size: 20px; font-weight: 600;">Languages: <span style = "font-weight: 400">${Object.values(country.languages)}</span></p>
         </li>
         </ul>`;
      })
      .join('');
   countryInfoEl.innerHTML = markup;
}

function clearMarkup() {
   countryListEl.innerHTML = '';
   countryInfoEl.innerHTML = '';
}