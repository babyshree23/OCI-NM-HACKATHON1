// Replace with your OpenWeatherMap API Key
const API_KEY = 'YOUR_API_KEY';

// DOM Elements
const cityNameInput = document.getElementById('city-name');
const searchButton = document.getElementById('search-btn');
const weatherDataDiv = document.getElementById('weather-data');
const errorMessageDiv = document.getElementById('error-message');
const temperatureDiv = document.getElementById('temperature');
const humidityDiv = document.getElementById('humidity');
const windSpeedDiv = document.getElementById('wind-speed');
const conditionsDiv = document.getElementById('conditions');
const dateTimeDiv = document.getElementById('date-time');
const forecastDiv = document.getElementById('forecast-details');

// Function to fetch weather data
async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        // Display weather data
        displayWeatherData(data);

        // Get and display the 7-day forecast
        getForecastData(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}

// Function to display weather data
function displayWeatherData(data) {
    errorMessageDiv.textContent = '';
    weatherDataDiv.style.display = 'block';

    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    temperatureDiv.textContent = `Temperature: ${data.main.temp}°C`;
    humidityDiv.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeedDiv.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    conditionsDiv.textContent = `Conditions: ${data.weather[0].description}`;
    dateTimeDiv.textContent = `Last updated: ${formattedDate}`;
}

// Function to get the 7-day forecast
async function getForecastData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Display the 7-day forecast
        displayForecast(data.daily);
    } catch (error) {
        console.error('Forecast fetching error: ', error);
    }
}

// Function to display 7-day forecast
function displayForecast(forecastData) {
    forecastDiv.innerHTML = '';
    forecastData.forEach((day, index) => {
        if (index < 7) {
            const dayDiv = document.createElement('div');
            dayDiv.innerHTML = `
                <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>${day.temp.day}°C</p>
                <p>${day.weather[0].main}</p>
            `;
            forecastDiv.appendChild(dayDiv);
        }
    });
}

// Function to show error message
function showError(message) {
    errorMessageDiv.textContent = `Error: ${message}`;
    weatherDataDiv.style.display = 'none';
}

// Event listener for search button
searchButton.addEventListener('click', () => {
    const city = cityNameInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a valid city or zip code.');
    }
});
