document.addEventListener('DOMContentLoaded', () => {
    const placeInfo = document.getElementById('place-info');
    const reviewsList = document.getElementById('reviews-list');
    const addReviewSection = document.getElementById('add-review-section');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');
    const reviewLinkContainer = document.getElementById('add-review-link');

    // Get place ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');

    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

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
            addReviewSection.style.display = 'block';
            createReviewLink(placeId);
        } else {
            loginLink.style.display = 'block';
            logoutButton.style.display = 'none';
            addReviewSection.style.display = 'none';
        }
    }

    function createReviewLink(placeId) {
        const link = document.createElement('a');
        link.href = `add_review.html?id=${placeId}`;
        link.className = 'review-button';
        link.textContent = 'Publier votre avis';
        reviewLinkContainer.appendChild(link);
    }

    async function fetchPlaceDetails() {
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
                fetchReviews();
            } else {
                console.error('Failed to fetch place details:', response.statusText);
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    }

    function displayPlaceDetails(place) {
        placeInfo.innerHTML = `
            <h1>${place.title}</h1>
            <div class="place-image-container">
                <div class="place-image-placeholder">${place.title[0].toUpperCase()}</div>
            </div>
            <div class="place-info">
                <p class="place-price">$${place.price} per night</p>
                <p class="place-description">${place.description || 'No description available'}</p>
                <p class="place-location">Location: ${place.latitude}, ${place.longitude}</p>
            </div>
        `;
    }

    async function fetchReviews() {
        try {
            const token = getCookie('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}/reviews`, {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const reviews = await response.json();
                displayReviews(reviews);
            } else {
                console.error('Failed to fetch reviews:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    function displayReviews(reviews) {
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>Aucun avis pour le moment. Soyez le premier à partager le vôtre !</p>';
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-rating">Note : ${review.rating}/5</span>
                    <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }

    function logout() {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = 'login.html';
    }

    logoutButton.addEventListener('click', logout);

    // Init
    checkAuth();
    fetchPlaceDetails();
});
