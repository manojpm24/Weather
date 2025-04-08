        const apiKey = 'cb0a46ed15479fd533097046d372dff6'; 
        const weatherContainer = document.getElementById('weather-container');
        const errorMessage = document.getElementById('error-message');
        const loading = document.getElementById('loading');
        const cityInput = document.getElementById('city-input');

        
        cityInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                checkWeather();
            }
        });

        
        async function checkWeather() {
            const city = document.getElementById('city-input').value;
            if (!city) return;
            
          
            loading.style.display = 'block';
            errorMessage.style.display = 'none';
            weatherContainer.style.display = 'none';
            
            try {
              
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
                
                if (!weatherResponse.ok) {
                    throw new Error('City not found');
                }
                
                const weatherData = await weatherResponse.json();
                
                
                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
                const forecastData = await forecastResponse.json();
                
                
                updateWeatherUI(weatherData);
                
                
                updateForecastUI(forecastData);
                
              
                weatherContainer.style.display = 'block';
                loading.style.display = 'none';
                
            } catch (error) {
                console.error('Error fetching weather data:', error);
                errorMessage.style.display = 'block';
                loading.style.display = 'none';
            }
        }

        
        function updateWeatherUI(data) {
            document.getElementById('city').innerHTML = `${data.name}, ${data.sys.country}`;
            
            
            const today = new Date();
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            document.getElementById('date').innerHTML = today.toLocaleDateString('en-US', options);
            
           
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.getElementById('weather-icon').src = iconUrl;
            
            
            document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}°C`;
            document.getElementById('weather-type').innerHTML = data.weather[0].description;
            document.getElementById('min-max').innerHTML = `Min: ${Math.round(data.main.temp_min)}°C | Max: ${Math.round(data.main.temp_max)}°C`;
            
            
            document.getElementById('humidity').innerHTML = `${data.main.humidity}%`;
            document.getElementById('wind-speed').innerHTML = `${data.wind.speed} m/s`;
        }

        
        function updateForecastUI(data) {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = '';
            
            
            const dailyData = [];
            
           
            const forecasts = data.list;
            const processedDates = new Set();
            
            for (const forecast of forecasts) {
                const forecastDate = new Date(forecast.dt * 1000);
                const dateStr = forecastDate.toDateString();
                
                
                if (forecastDate.getDate() === new Date().getDate()) continue;
                if (processedDates.has(dateStr)) continue;
                
                
                processedDates.add(dateStr);
                dailyData.push(forecast);
                
                
                if (dailyData.length >= 3) break;
            }
            
           
            dailyData.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const iconCode = day.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
                const temp = Math.round(day.main.temp);
                const description = day.weather[0].description;
                
                const forecastCard = document.createElement('div');
                forecastCard.classList.add('forecast-card');
                forecastCard.innerHTML = `
                    <div class="forecast-day">${dayName}</div>
                    <img src="${iconUrl}" alt="${description}">
                    <div class="forecast-temp">${temp}°C</div>
                    <div class="forecast-desc">${description}</div>
                `;
                
                forecastContainer.appendChild(forecastCard);
            });
        }

        
        window.onload = function() {
            document.getElementById('city-input').value = 'Bangalore';
            checkWeather();
        };
 