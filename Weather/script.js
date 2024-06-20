const apiKey = "d4a52ccbf4504eb4916142034233110";
const apiDays = 3;
const apiLang = "uk";

document.addEventListener('DOMContentLoaded', () => {
    const isSuccess = localStorage.getItem('isSuccess');
    const storedCity = localStorage.getItem('weatherCity');

    if (isSuccess==='true'){
        const buttonSign=document.getElementById('buttonSign');
        buttonSign.innerText='Вийти';
    }

    if (isSuccess === 'true' && storedCity) {
        document.getElementById('newCity').value = storedCity;
        fetchWeather(storedCity);
    }
});

function SignIn(){
    const buttonSign=document.getElementById('buttonSign');
    const isSuccess = localStorage.getItem('isSuccess');
    if(isSuccess === 'true'){
        buttonSign.innerText='Увійти/Зареєструватися';
        localStorage.setItem('isSuccess', 'false');
    }
    else{
        window.location.href = '/SignIn/';
    }
}

function ShowWeather(e) {
    e.preventDefault();
    const detailedWeather = document.getElementById('detailedWeather');
    detailedWeather.innerHTML='';
    fetchWeather();
}

async function fetchWeather() {
    const city = document.getElementById("newCity").value;
    const isSuccess = localStorage.getItem('isSuccess');
    const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?q=${city}&days=${apiDays}&lang=${apiLang}&key=${apiKey}`;
    try {
        const response = await fetch(weatherApiUrl);
        const data = await response.json();
        if (data && data.forecast && data.forecast.forecastday) {
            displayWeather(data.forecast.forecastday);
            if (isSuccess === 'true'){
                localStorage.setItem('weatherCity', city);
            }
        } 
        else {
            document.getElementById('weatherList').innerHTML = `<p>Weather not found</p>`;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('weatherList').innerHTML = `<p>Error fetching data</p>`;
    }
}

function displayWeather(forecastDays) {
    const weatherList = document.getElementById('weatherList');
    weatherList.innerHTML = '';

    for (let i = 0; i < forecastDays.length; i++) {
        const day = forecastDays[i];
        const date = new Date(day.date);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };

        const weatherBlock = document.createElement('div');
        weatherBlock.className = 'col-md-4';

        const weatherDay = document.createElement('div');
        weatherDay.className = 'weather-day';
        weatherDay.setAttribute('onclick', `showDetailedWeather(${i})`);

        const img = document.createElement('img');
        img.src = day.day.condition.icon;
        img.alt = 'weather icon';

        const weatherInfo = document.createElement('div');

        const h5 = document.createElement('h5');
        h5.textContent = date.toLocaleDateString('uk-UA', options);

        const p = document.createElement('p');
        p.textContent = `Max: ${day.day.maxtemp_c}°C, Min: ${day.day.mintemp_c}°C`;

        weatherInfo.appendChild(h5);
        weatherInfo.appendChild(p);

        weatherDay.appendChild(img);
        weatherDay.appendChild(weatherInfo);

        weatherBlock.appendChild(weatherDay);
        weatherList.appendChild(weatherBlock);
    }

    window.forecastDays = forecastDays;
}

function showDetailedWeather(index) {
    const isSuccess = localStorage.getItem('isSuccess');
    if (isSuccess !== 'true') {
        alert("Увійдіть, щоб переглянути детальнішу інформацію.");
        return;
    }

    const day = window.forecastDays[index];
    const detailedWeatherDiv = document.getElementById('detailedWeather');
    detailedWeatherDiv.innerHTML = '';

    const h3 = document.createElement('h3');
    h3.textContent = new Date(day.date).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const headers = ['Час', 'Ніч (02:00)', 'Ранок (07:00)', 'Обід (13:00)', 'Вечір (20:00)'];
    
    for (let i = 0; i < headers.length; i++) {
        const th = document.createElement('th');
        th.textContent = headers[i];
        headRow.appendChild(th);
    }
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    const parameters = ['Температура', 'Вітер (км/год)', 'Вологість (%)', 'Тиск (мм рт. ст.)'];
    const keys = ['temp_c', 'wind_kph', 'humidity', 'pressure_mb'];
    const hours = [2, 7, 13, 20];

    for (let i = 0; i < parameters.length; i++) {
        const row = document.createElement('tr');
        const paramCell = document.createElement('td');
        paramCell.textContent = parameters[i];
        row.appendChild(paramCell);

        for (let j = 0; j < hours.length; j++) {
            const valueCell = document.createElement('td');
            if(j==0||j==1){
                valueCell.textContent = getWeatherDetail(day.hour, `0${hours[j]}:00`, keys[i]);
                
            }
            else{
                valueCell.textContent = getWeatherDetail(day.hour, `${hours[j]}:00`, keys[i]);
            }
            row.appendChild(valueCell);
        }

        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    detailedWeatherDiv.appendChild(h3);
    detailedWeatherDiv.appendChild(table);
}

function getWeatherDetail(hours, hour, parameter) {
    for(let i=0; i<hours.length; i++) {
        if(hours[i].time.split(" ")[1]===hour) {
            return hours[i][parameter];
        }
    }
}




