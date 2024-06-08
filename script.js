document.getElementById('fetchWeatherBtn').addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '1707a4c7abe4ab14246a23af2fde2feb'; // replace with your OpenWeatherMap API key

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            document.getElementById('currentWeather').style.display = 'none';
            alert('Error fetching current weather. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            document.getElementById('forecast').style.display = 'none';
            alert('Error fetching forecast. Please try again.');
        });
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.style.display = 'block';
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather</h2>
        <p>${data.name}, ${data.sys.country}</p>
        <p>${data.weather[0].description}</p>
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon" class="weatherIcon">
        <p>Temp: ${data.main.temp} &deg;C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.style.display = 'flex';
    forecastDiv.innerHTML = '';

    // Pobierz datę bieżącą
    let currentDate = new Date();

    // Iteruj przez każdy dzień w prognozie
    data.list.forEach((day, index) => {
        // Dodaj odpowiednią liczbę dni do bieżącej daty
        currentDate.setDate(currentDate.getDate() + 1);

        // Wyświetl datę w formacie DD.MM
        const formattedDate = currentDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });

        // Skróć opis pogody, aby zmieścił się w kontenerze
        const shortDescription = day.weather[0].description.length > 20 ? day.weather[0].description.substring(0, 10) + '...' : day.weather[0].description;
        
        // Dodaj dane dla danego dnia do diva prognozy
        forecastDiv.innerHTML += `
        <div class="forecast-day">
            <p>${formattedDate}</p>
            <p>${shortDescription}</p>
            <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="Weather icon" class="weatherIcon">
            <p class="temp">Temp: ${day.main.temp.toFixed(1)} &deg;C</p> <!-- Zaokrąglamy temperaturę do jednego miejsca po przecinku -->
            </div>
        `;
    });
}

