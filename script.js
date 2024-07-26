document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 13);

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            marker.bindPopup("You are here.").openPopup();

            showInputPopup(lat, lng, marker);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function showInputPopup(lat, lng, marker) {
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Enter your story...';
        popupContent.appendChild(textarea);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        popupContent.appendChild(fileInput);

        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.textContent = 'Save';

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-button');
        cancelButton.textContent = 'Cancel';

        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        popupContent.appendChild(buttonContainer);

        marker.bindPopup(popupContent).openPopup();

        cancelButton.addEventListener('click', () => {
            map.removeLayer(marker);
        });

        saveButton.addEventListener('click', () => {
            const story = textarea.value;
            const file = fileInput.files[0];
            if (story || file) {
                let content;
                if (file) {
                    const url = URL.createObjectURL(file);
                    content = `<video controls width="200"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
                } else {
                    content = `<p>${story}</p>`;
                }
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    map.removeLayer(marker);
                });

                const contentWrapper = document.createElement('div');
                contentWrapper.innerHTML = content;
                contentWrapper.appendChild(deleteButton);

                marker.bindPopup(contentWrapper).openPopup();
            } else {
                map.removeLayer(marker);
            }
        });
    }

    map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        showInputPopup(lat, lng, marker);
    });

    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', function(e) {
        const latlng = e.geocode.center;
        map.setView(latlng, 13);

        const marker = L.marker(latlng, { icon: customIcon }).addTo(map);
        marker.bindPopup(e.geocode.name).openPopup();
    })
    .addTo(map);
});
