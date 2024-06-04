document.getElementById('fetchWeatherBtn').addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const apiKey = '1707a4c7abe4ab14246a23af2fde2feb';  // Twój klucz API z OpenWeatherMap
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    console.log('Current Weather URL:', currentWeatherUrl);
    console.log('Forecast URL:', forecastUrl);

    fetch(currentWeatherUrl)
        .then(response => {
            console.log('Current Weather Response Status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Current Weather Data:', data);
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Error fetching current weather. Please check the city name and API key.');
        });

    fetch(forecastUrl)
        .then(response => {
            console.log('Forecast Response Status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Forecast Data:', data);
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            alert('Error fetching forecast. Please check the city name and API key.');
        });
}

function displayCurrentWeather(data) {
    const weatherContainer = document.getElementById('currentWeather');
    weatherContainer.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>${data.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="weatherIcon">
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';
    forecastContainer.innerHTML += '<div class="forecast-flex">';

    // Używamy obiektu, aby uzyskać unikalne dni
    const forecastByDay = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!forecastByDay[date]) {
            forecastByDay[date] = item;
        }
    });

    // Wyświetlamy tylko 5 dni
    const dates = Object.keys(forecastByDay).slice(0, 5);
    dates.forEach(date => {
        const item = forecastByDay[date];
        const forecastElement = document.createElement('div');
        forecastElement.innerHTML = `
            <p><strong>${new Date(item.dt * 1000).toLocaleDateString()}</strong></p>
            <p>${item.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" class="weatherIcon">
            <p>Temp: ${item.main.temp} °C</p>
        `;
        forecastContainer.querySelector('.forecast-flex').appendChild(forecastElement);
    });

    forecastContainer.innerHTML += '</div>';
}
