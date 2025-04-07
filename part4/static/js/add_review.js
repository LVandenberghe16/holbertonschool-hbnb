document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('review-form');
  const loginLink = document.getElementById('login-link');
  const logoutButton = document.getElementById('logout-button');

  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get('id');

  if (!placeId) {
    alert("Aucun logement sélectionné !");
    window.location.href = "index.html";
    return;
  }

  fetchPlaceDetails(placeId);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function checkAuth() {
    const token = getCookie('token');
    if (token) {
      loginLink.style.display = 'none';
      logoutButton.style.display = 'block';
    } else {
      loginLink.style.display = 'block';
      logoutButton.style.display = 'none';
    }
  }

  logoutButton.addEventListener('click', () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = 'login.html';
  });

  async function submitReview(text, rating) {
    try {
      const token = getCookie('token');
      if (!token) {
        window.location.href = 'login.html';
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, rating: parseInt(rating) })
      });

      if (response.ok) {
        alert("Merci pour votre avis !");
        reviewForm.reset();
        window.location.href = `place.html?id=${placeId}`;
      } else {
        const error = await response.json();
        alert(error.message || 'Échec de la soumission de l’avis');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de l’avis :', error);
      alert('Une erreur est survenue.');
    }
  }

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    submitReview(text, rating);
  });

  async function fetchPlaceDetails(placeId) {
    try {
      const token = getCookie('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const place = await response.json();
        displayPlaceDetails(place);
      } else {
        console.error('Impossible de charger les infos du logement');
      }
    } catch (error) {
      console.error('Erreur fetchPlaceDetails:', error);
    }
  }

  function displayPlaceDetails(place) {
    const container = document.getElementById('place-info');
    container.innerHTML = `
      <h1>${place.title}</h1>
      <p class="place-price">Prix : $${place.price} / nuit</p>
      <p class="place-description">${place.description || 'Pas de description disponible.'}</p>
      <p class="place-location">Emplacement : ${place.latitude}, ${place.longitude}</p>
      <hr />
    `;
  }

  checkAuth();
});
