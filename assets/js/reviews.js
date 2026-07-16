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
