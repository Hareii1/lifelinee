// Data loaded from data.js

// Map Logic
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    renderHospitals();
    handleRequest();
});

let map;
let userMarker;
let ambulanceMarker;

function initMap() {
    // Center map around Changa/Ramol region (Approx 22.60, 72.82)
    // Using Leaflet
    const defaultLocation = [22.6010, 72.8220]; // Near Changa

    map = L.map('map').setView(defaultLocation, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Custom Icons
    const userIcon = L.divIcon({
        html: '<div style="background-color: #0066cc; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3);"></div>',
        className: 'user-marker-icon',
        iconSize: [20, 20]
    });

    const hospitalIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', // Generic Hospital Icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const ambulanceIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2618/2618528.png', // Generic Ambulance Icon
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add User (Mock Location)
    userMarker = L.marker(defaultLocation, { icon: userIcon }).addTo(map)
        .bindPopup("<b>Your Location</b><br>Near Changa").openPopup();

    // Add Hospitals
    hospitals.forEach(h => {
        L.marker([h.lat, h.lng], { icon: hospitalIcon })
            .addTo(map)
            .bindPopup(`<b>${h.name}</b><br>Beds Available: ${h.beds}<br>${h.contact}`);
    });

    // Add Mock Ambulance
    const ambStart = [22.5900, 72.8100];
    ambulanceMarker = L.marker(ambStart, { icon: ambulanceIcon }).addTo(map)
        .bindPopup("<b>Ambulance Unit 101</b><br>Status: Available");

    // Simulate Ambulance Movement
    let step = 0;
    setInterval(() => {
        step += 0.0001;
        const newLat = 22.5900 + Math.sin(step) * 0.005;
        const newLng = 72.8100 + Math.cos(step) * 0.005;
        ambulanceMarker.setLatLng([newLat, newLng]);
    }, 100);
}

function renderHospitals() {
    const list = document.getElementById('hospital-list');
    if (!list) return;

    list.innerHTML = hospitals.map(h => `
        <div class="hospital-card">
            <span class="status-badge status-available">
                <i class="fa-solid fa-bed"></i> ${h.beds} Beds
            </span>
            <h3>${h.name}</h3>
            <div class="info-row">
                <i class="fa-solid fa-map-pin"></i>
                <span>${h.location} (${h.distance})</span>
            </div>
            <div class="info-row">
                <i class="fa-solid fa-phone"></i>
                <span>${h.contact}</span>
            </div>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="window.location.href='hospital.html'" class="btn btn-primary" style="flex: 1; border-radius: 8px; padding: 8px; font-size: 0.9rem;">
                    View Details
                </button>
                <button onclick="window.location.href='https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}'" class="btn btn-outline" style="flex: 1; border-radius: 8px; padding: 8px; font-size: 0.9rem;">
                    <i class="fa-solid fa-diamond-turn-right"></i> Route
                </button>
            </div>
        </div>
    `).join('');
}

function handleRequest() {
    const btn = document.getElementById('requestBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Contacting nearby units...';
        btn.style.background = '#eab308'; // yellow

        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Ambulance Dispatched!';
            btn.style.background = '#10b981'; // green
            alert("Ambulance request sent! A unit has been dispatched to your location.");
        }, 2000);
    });
}
