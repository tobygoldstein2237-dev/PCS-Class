"use strict";

let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 39.8283,
            lng: -98.5795
        },
        zoom: 4
    });
}

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const statusText = document.getElementById("status");

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let searchTerm = searchInput.value;

    statusText.textContent = "Searching...";
    resultsDiv.innerHTML = "";

    let username = "tobygoldstein2237";

    let url = `https://secure.geonames.org/wikipediaSearchJSON?q=${encodeURIComponent(searchTerm)}&maxRows=10&username=${encodeURIComponent(username)}`;

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        let data = await response.json();

        if (data.status) {
            throw new Error(data.status.message);
        }

        console.log(data);

        statusText.textContent = `Found ${data.geonames.length} results`;

        displayResults(data.geonames);

    } catch (error) {
        statusText.textContent = "Error loading results";
        console.log(error);
    }
});

function displayResults(places) {
    markers.forEach(function (marker) {
        marker.setMap(null);
    });

    markers = [];

    let bounds = new google.maps.LatLngBounds();

    places.forEach(function (place) {
        let div = document.createElement("div");
        div.className = "result";

        let title = document.createElement("h3");
        title.textContent = place.title;

        let summary = document.createElement("p");
        summary.textContent = place.summary;

        div.appendChild(title);

        if (place.thumbnailImg) {
            let img = document.createElement("img");

            img.src = place.thumbnailImg;
            img.alt = place.title;

            div.appendChild(img);
        }

        div.appendChild(summary);

        resultsDiv.appendChild(div);

        if (place.lat == null || place.lng == null) {
            return;
        }

        let location = {
            lat: Number(place.lat),
            lng: Number(place.lng)
        };

        let marker = new google.maps.Marker({
            position: location,
            map: map,
            title: place.title
        });

        markers.push(marker);

        div.addEventListener("click", function () {
            map.panTo(location);
            map.setZoom(12);

            infoWindow.open({
                anchor: marker,
                map: map
            });
        });

        let infoDiv = document.createElement("div");

        let infoTitle = document.createElement("h3");
        infoTitle.textContent = place.title;

        let infoSummary = document.createElement("p");
        infoSummary.textContent = place.summary;

        infoDiv.appendChild(infoTitle);
        infoDiv.appendChild(infoSummary);

        if (place.wikipediaUrl) {
            let wikiLink = document.createElement("a");

            wikiLink.href = "https://" +
                place.wikipediaUrl.replace(/^https?:\/\//, "");

            wikiLink.textContent = "Read on Wikipedia";
            wikiLink.target = "_blank";
            wikiLink.rel = "noopener noreferrer";

            infoDiv.appendChild(wikiLink);
        }

        let infoWindow = new google.maps.InfoWindow({
            content: infoDiv
        });

        marker.addListener("click", function () {
            infoWindow.open({
                anchor: marker,
                map: map
            });
        });

        bounds.extend(location);
    });

    if (markers.length > 0) {
        map.fitBounds(bounds);
    }
}