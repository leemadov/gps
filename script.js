let previousPosition = null;
let previousTime = null;
let highestSpeed = 0;
let selectedEnvironment = 'Ground';
let speedReadings = [];

function calculateSpeed(position) {
    const currentPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude || 0,
        time: new Date().getTime()
    };

    if (previousPosition) {
        const distance = getDistanceFromLatLonInKm(
            previousPosition.latitude,
            previousPosition.longitude,
            currentPosition.latitude,
            currentPosition.longitude
        );

        const timeElapsed = (currentPosition.time - previousTime) / 1000; // seconds

        if (distance > 0.001) { // Ignore very small movements
            const speed = (distance / timeElapsed) * 3600; // km/h

            // Add speed to readings array for averaging
            speedReadings.push(speed);
            if (speedReadings.length > 5) {
                speedReadings.shift(); // Keep only the last 5 readings
            }

            const averageSpeed = speedReadings.reduce((a, b) => a + b, 0) / speedReadings.length;

            document.getElementById('speed').innerText = `Speed: ${averageSpeed.toFixed(2)} km/h`;

            // Update highest speed
            if (averageSpeed > highestSpeed) {
                highestSpeed = averageSpeed;
                document.getElementById('highest-speed').innerText = `Highest Speed: ${highestSpeed.toFixed(2)} km/h`;
            }

            // Display altitude
            const altitude = currentPosition.altitude;
            document.getElementById('altitude').innerText = `Altitude: ${altitude.toFixed(2)} m`;

            // Display selected environment
            document.getElementById('environment').innerText = `Environment: ${selectedEnvironment}`;
        }
    }

    previousPosition = currentPosition;
    previousTime = currentPosition.time;
}

function updateEnvironment() {
    const environmentSelect = document.getElementById('environment-select');
    selectedEnvironment = environmentSelect.value;
    document.getElementById('environment').innerText = `Environment: ${selectedEnvironment}`;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(calculateSpeed, showError, {
        enableHighAccuracy: true,
        maximumAge: 100,   // Update every 0.1 seconds
        timeout: 100       // Wait no longer than 0.1 seconds for a response
    });
} else {
    alert('Geolocation is not supported by this browser.');
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
