const GRAPHHOPPER_API_KEY = process.env.GRAPHHOPPER_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// get main app elements
const $body = document.querySelector("body");
const $app = document.querySelector("#app");
const $cityWeatherBox = document.querySelector(".module__weather");
const $addCityForm = document.querySelector(".module__form");
const $inputCity = document.querySelector("#search");

// get button elements
const $addCityBtn = document.querySelector("#add-city");
const $closeWindowBtn = document.querySelector(".btn--close")

// get elements for current weather display
const $weatherInfo = document.querySelector(".weather__info");
const $weatherDetails = document.querySelector(".weather__details");
const $city = $weatherInfo.querySelector(".city__name");
const $temperature = $weatherInfo.querySelector(".temperature__value");
const $humidity = $weatherDetails.querySelector(".humidity__value");
const $pressure = $weatherDetails.querySelector(".pressure__value");
const $windSpeed = $weatherDetails.querySelector(".wind-speed__value");
const $icon = document.querySelector(".weather__icon img");

//get elements for weather forecast display
const $daysOfTheWeek = document.querySelectorAll(".day");
const $daysOfTheWeekTemp = document.querySelectorAll(".temperature_forecast");
const $dayOfTheWeekIcon = document.querySelectorAll(".weather__forecast img");

// get geolocation from IP address
const getIp = async () => {
    try {
        let ipData = await fetch('http://ip-api.com/json/');
        ipData = await ipData.json();
        console.log(ipData);
        return ipData;
    } catch (e) {
        console.log('Something went wrong', e);
        return null;
    }
}

// get weather data from OpenWeatherMap API
const getWeatherData = async (latitude, longitude) => {
    try {
        let weatherData = await fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        weatherData = await weatherData.json();
        console.log(weatherData);
        return weatherData;
    } catch (e) {
        console.log('Something went wrong', e);
        return null;
    }
};

// get geolocation by city name
const getCityGeolocation = async (city) => {
    try {
        let geolocationData = await fetch(`https://graphhopper.com/api/1/geocode?key=${GRAPHHOPPER_API_KEY}&q=${city}`);
        geolocationData = await geolocationData.json();
        return geolocationData.hits[0].point;
    } catch (e) {
        console.log("Something went wrong", e);
    }
};


// display weather for current geolocation based on IP address
getIp().then(ip => {
    let lat = ip.lat;
    let long = ip.lon;
    let location = ip.city;
    getWeatherData(lat, long).then(data => {
        $body.classList.remove('loading');
        $app.classList.remove('hidden');
        displayWeather(data, location);
    });
})

// display form for adding a new city
$addCityBtn.addEventListener("click", () => {
    $addCityForm.hidden = false;

// display weather based on user's search
    $addCityForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let city = $inputCity.value;
        getCityGeolocation(city).then(geolocationData => {
            let latitude = geolocationData.lat;
            let longitude = geolocationData.lng;
            // console.log(geolocationData);
            getWeatherData(latitude, longitude).then(weather => {
                let $newCityWeatherBox = $cityWeatherBox.cloneNode(true);
                $app.appendChild($newCityWeatherBox);
                displayWeather(weather, city);
            });
        });
    })
});

// function for displaying weather data
const displayWeather = (weatherData, location) => {

    console.log(weatherData);
    let humidity = weatherData.current.humidity;
    let pressure = weatherData.current.pressure;
    let temp = weatherData.current.temp;
    let windSpeed = weatherData.current.wind_speed;
    let weatherIconNow = weatherData.current.weather[0].icon;
    console.log(weatherIconNow);


    $city.innerHTML = location;
    $temperature.innerHTML = `${temp.toFixed()} &deg;C`;
    $humidity.innerHTML = `${humidity} %`;
    $pressure.innerHTML = `${pressure} hPa`;
    $windSpeed.innerHTML = `${windSpeed} m/s`;
    $icon.src = `images/icons/${getWeatherIcon(weatherIconNow)}.svg`;


    for (let i = 0; i < $daysOfTheWeek.length; i++) {
        const weatherDataDay = weatherData.daily[(i + 1) % 7]
        const dayOfTheWeek = getDayOfTheWeek(weatherDataDay.dt);
        const dayOfTheWeekTemp = weatherDataDay.temp.day.toFixed();
        const dayOfTheWeekIcon = weatherDataDay.weather[0].icon;
        $daysOfTheWeek[i].innerHTML = dayOfTheWeek;
        $daysOfTheWeekTemp[i].innerHTML = `${dayOfTheWeekTemp} &deg;C`;
        $dayOfTheWeekIcon[i].src = `images/icons/${getWeatherIcon(dayOfTheWeekIcon)}.svg`;
    }
};

// function for setting day of the week
const getDayOfTheWeek = (timestamp) => {
    let dateToday = new Date(timestamp * 1000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dateToday.getDay()];
};

// function for setting weather icon
const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
        case '01d':
            return "clear-day";
        case '01n' :
            return "clear-night";
        case '02d':
            return "partly-cloudy-day";
        case '02n' :
            return "partly-cloudy-night";
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return "cloudy";
        case '10d':
        case '10n':
            return "rain";
        case '11d':
        case '11n':
            return "thunderstorm";
        case '13d':
        case '13n':
            return "snow";
        case '50d':
        case '50n':
            return "fog";
    }
}



