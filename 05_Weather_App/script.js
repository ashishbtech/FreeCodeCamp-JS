const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');

const locationName = document.getElementById('location-name');
const locationCountry = document.getElementById('location-country');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');

const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

const interpretWeatherCode = (code) => {
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        95: "Thunderstorm"
    };
    return weatherCodes[code] || "Variable conditions";
};

const fetchLocationData = async (city) => {
    try {
        const response = await fetch(`${GEOCODE_API_URL}?name=${city}&count=1&language=en&format=json`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error("City not found");
        }
        
        return data.results[0];
    } catch (error) {
        throw error;
    }
};

const fetchWeatherData = async (lat, lon) => {
    try {
        const response = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`);
        if (!response.ok) throw new Error("Weather data fetch failed");
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

const updateUI = (locationData, weatherData) => {
    const current = weatherData.current_weather;
    const currentHumidity = weatherData.hourly.relativehumidity_2m[0];

    locationName.textContent = locationData.name;
    locationCountry.textContent = locationData.country || "";
    
    temperature.textContent = `${Math.round(current.temperature)}°`;
    weatherDescription.textContent = interpretWeatherCode(current.weathercode);
    
    windSpeed.textContent = `${Math.round(current.windspeed)} km/h`;
    humidity.textContent = `${currentHumidity}%`;

    errorMessage.textContent = "";
    weatherDisplay.classList.remove('hidden');
};

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    
    if (!city) return;

    try {
        weatherDisplay.classList.add('hidden');
        errorMessage.textContent = "Fetching data...";
        
        const locationData = await fetchLocationData(city);
        const weatherData = await fetchWeatherData(locationData.latitude, locationData.longitude);
        
        updateUI(locationData, weatherData);
        cityInput.value = "";
    } catch (error) {
        errorMessage.textContent = error.message === "City not found" 
            ? "Location not found. Please try again." 
            : "An error occurred while fetching data.";
    }
});