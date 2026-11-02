const key = 'slubowsky';

const [{ Map, InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary('maps'),
    google.maps.importLibrary('marker')
]);

const map = new Map(document.querySelector('#map'), {
    center: { lat: 40.09543950426593, lng: -74.2221793333354 },
    zoom: 18,
    mapId: 'DEMO_MAP_ID'
});

const placesList = document.querySelector('#places');
const searchInput = document.querySelector('#search');
const clearBtn = document.querySelector('#clearBtn');

const infoWindow = new InfoWindow();

let currentlySelectedSummary;

// Array to store all found places
let places = JSON.parse(localStorage.getItem('places') || '[]');

// Array to keep track of markers on the map
let markers = [];


// Function to add a place to the map and sidebar
function addPlace(place) {

    const loc = {
        lat: Number(place.lat),
        lng: Number(place.lng)
    };

    const img = document.createElement('img');
    img.src = place.thumbnailImg || './chulent.jpg';
    img.alt = place.title;
    img.className = 'marker-image';

    const marker = new AdvancedMarkerElement({
        map,
        position: loc,
        title: place.title
    });

    // Save marker so we can remove it later
    markers.push(marker);

    marker.addListener('click', () => {
        infoWindow.setContent(`
            <div>
                <h5>${place.title}</h5>
                ${place.summary}
                <a target="_blank" href="https://${place.wikipediaUrl}">
                    more info
                </a>
            </div>
        `);

        infoWindow.open({
            anchor: marker
        });
    });

    marker.append(img);

    const placeLi = document.createElement('li');

    placeLi.innerHTML = `
        <div>
            <div class="info">
                <span>${place.title}</span>
                <img src="${place.thumbnailImg || './chulent.jpg'}"
                     alt="${place.title}" />
            </div>
            <div class="summary">${place.summary}</div>
        </div>
    `;

    placesList.append(placeLi);

    const summary = placeLi.querySelector('.summary');

    placeLi.addEventListener('click', async () => {

        map.setZoom(6);

        if (currentlySelectedSummary) {
            currentlySelectedSummary.classList.remove('active');
        }

        currentlySelectedSummary = summary;
        currentlySelectedSummary.classList.add('active');

        await doAfter(() => map.panTo(loc), 1500);
        await doAfter(() => map.setZoom(18), 1500);
    });
}


// Function to fit map around all saved places
function fitMapToPlaces() {

    if (places.length === 0) {
        return;
    }

    const bounds = new google.maps.LatLngBounds();

    places.forEach(place => {
        bounds.extend({
            lat: Number(place.lat),
            lng: Number(place.lng)
        });
    });

    map.fitBounds(bounds);
}


// Restore saved places when page loads
places.forEach(place => {
    addPlace(place);
});

fitMapToPlaces();


// Search for new places
document.querySelector('#searchForm').addEventListener('submit', async e => {

    e.preventDefault();

    try {

        const response = await fetch(
            `https://api.geonames.org/wikipediaSearchJSON?q=${encodeURIComponent(searchInput.value)}&maxRows=10&username=${key}`
        );

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const { geonames } = await response.json();

        console.log(geonames);

        geonames.forEach(place => {

            // Keep only the information we actually use
            const newPlace = {
                title: place.title,
                summary: place.summary,
                lat: Number(place.lat),
                lng: Number(place.lng),
                wikipediaUrl: place.wikipediaUrl,
                thumbnailImg: place.thumbnailImg
            };

            // Don't add the same Wikipedia article twice
            const alreadyExists = places.some(savedPlace =>
                savedPlace.wikipediaUrl === newPlace.wikipediaUrl
            );

            if (!alreadyExists) {

                places.push(newPlace);

                addPlace(newPlace);
            }
        });

        // Save all places from all searches
        localStorage.setItem('places', JSON.stringify(places));

        // Show all places on map
        fitMapToPlaces();

        searchInput.value = '';

    } catch (e) {
        console.error(e);
    }
});


// Clear all saved places
clearBtn.addEventListener('click', () => {

    // Remove all markers from the map
    markers.forEach(marker => {
        marker.map = null;
    });

    markers = [];

    // Clear sidebar
    placesList.innerHTML = '';

    // Clear saved places array
    places = [];

    // Remove saved places from local storage
    localStorage.removeItem('places');

    // Close any open info window
    infoWindow.close();

    currentlySelectedSummary = null;

    // Reset map to original position
    map.setCenter({
        lat: 40.09543950426593,
        lng: -74.2221793333354
    });

    map.setZoom(18);
});


// Your original delay function
function doAfter(action, delay) {

    return new Promise(resolve => {

        setTimeout(() => {
            action();
            resolve();
        }, delay);

    });
}