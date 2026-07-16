/**
 * Google Reviews fetcher per Tocco Magico Coiffure
 *
 * PER ATTIVARE:
 * 1. Vai su https://console.cloud.google.com
 * 2. Crea un progetto (o usa uno esistente)
 * 3. Abilita "Places API" nelle API & Servizi
 * 4. Crea una chiave API in "Credenziali"
 * 5. Trova il Place ID su https://developers.google.com/maps/documentation/places/web-service/place-id
 *    (cerca "Tocco Magico Coiffure Bellinzona")
 * 6. Inseriscili qui sotto
 */
const GOOGLE_API_KEY = 'INSERISCI_LA_TUA_API_KEY';
const PLACE_ID = 'INSERISCI_IL_PLACE_ID';

function updateReviews() {
  if (GOOGLE_API_KEY === 'INSERISCI_LA_TUA_API_KEY') return;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&key=${GOOGLE_API_KEY}&fields=rating,user_ratings_total,reviews`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      if (data.result) {
        const rating = data.result.rating;
        const count = data.result.user_ratings_total;

        const ratingValue = document.getElementById('rating-value');
        const ratingCount = document.getElementById('rating-count');
        if (ratingValue) ratingValue.textContent = rating;
        if (ratingCount) ratingCount.textContent = `(${count} recensioni)`;
      }
    })
    .catch(err => console.warn('Errore Google Reviews:', err));
}

document.addEventListener('DOMContentLoaded', updateReviews);
