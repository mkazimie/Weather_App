const GRAPHHOPPER_API_KEY = process.env.GRAPHHOPPER_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const $body = document.querySelector("body");
const $weatherInfo = document.querySelector(".weather__info");
const $weatherDetails = document.querySelector(".weather__details");
const $city = $weatherInfo.querySelector(".city__name");
const $temperature = $weatherInfo.querySelector(".temperature__value");
const $humidity = $weatherDetails.querySelector(".humidity__value");
const $pressure = $weatherDetails.querySelector(".pressure__value");
const $windSpeed = $weatherDetails.querySelector(".wind-speed__value");
const $img = document.querySelector(".weather__icon img");

const $daysOfTheWeek = document.querySelectorAll(".day");
const $daysOfTheWeekTemp = document.querySelectorAll(".temperature_forecast");


const getIp = async () => {
    try {
        let ipData = await fetch('https://cors-anywhere.herokuapp.com/http://ip-api.com/json/');
        ipData = await ipData.json();
        console.log(ipData);
        return ipData;
    } catch (e) {
        console.log('Something went wrong', e);
        return null;
    }
}


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


getIp().then(ip => {
    let lat = ip.lat;
    let long = ip.lon;
    let location = ip.city;
    getWeatherData(lat, long).then(data => {
        $body.classList.remove('loading');
        displayWeather(data, location);
    });
})



const displayWeather = (weatherData, location) => {

    console.log(weatherData);
    let humidity = weatherData.current.humidity;
    let pressure = weatherData.current.pressure;
    let temp = weatherData.current.temp;
    let windSpeed = weatherData.current.wind_speed;



    $city.innerHTML = location;
    $temperature.innerHTML = `${temp.toFixed()} &deg;C`;
    $humidity.innerHTML = `${humidity} %`;
    $pressure.innerHTML = `${pressure} hPa`;
    $windSpeed.innerHTML = `${windSpeed} m/s`;


    for (let i = 0; i < $daysOfTheWeek.length ; i++) {
        const weatherDataDay = weatherData.daily[(i + 1) % 7]
        const dayOfTheWeek = getDayOfTheWeek(weatherDataDay.dt);
        const dayOfTheWeekTemp = weatherDataDay.temp.day.toFixed();
        $daysOfTheWeek[i].innerHTML = dayOfTheWeek;
        $daysOfTheWeekTemp[i].innerHTML = `${dayOfTheWeekTemp} &deg;C`;
    }


};

const getDayOfTheWeek = (timestamp) => {
    let dateToday = new Date(timestamp * 1000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dateToday.getDay()];
};








