// const { response } = require("express");

const input = document.querySelector('#zip');
const buttonInput = document.querySelector('.submit');
const entryHolder = document.querySelector('.entryHolder');
const current = document.querySelector('.current');
nvm -v
const apiKey = '49dd336c6342a0fbf7eba30d6af0f432';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const fiveDayUrl = 'http://api.openweathermap.org/data/2.5/onecall?';
const btn = document.getElementById('generate');
let getWeather;
let getForecast;
let journal;
let postServer;

// Enter key and Click event
input.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('generate').click();
  }
});

btn.addEventListener('click', btnFunction)

// Grab data
function btnFunction() {
  const zip = document.querySelector('#zip').value;
  getWeather(apiUrl, zip, apiKey)
    .then((obj) => {
      const lon = obj.coord.lon;
      const lat = obj.coord.lat;
      getForecast(lat, lon, apiKey);
      journal()
    })
}

// Grab data

// btn.addEventListener('click', () => {
//   const zip = document.querySelector('#zip').value;
//   const obj = getWeather(apiUrl, zip, apiKey);
//   const lon = obj.coord.lon;
//   const lat = obj.coord.lat;
//   const data = getForecast(lat, lon, apiKey);
//   await journal();
// })

// Convert Unix time code to something a Humon can read
const timeConverter = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  // const hour = a.getHours();
  // const min = a.getMinutes();
  // const sec = a.getSeconds();
  // const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  const time = date + ' ' + month + ' ' + year;
  console.log(date);
  const i = 0;
  const data = { list: [{ dt: UNIX_timestamp }] };
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNum = new Date(data.list[i].dt * 1000).getDay();
  const result = days[dayNum];
  const stuff = { time, result };
  return stuff;
};

// Icon function
const icons = (icon) => {
  let skyIcon = "images/thunderstorm.svg";
  const id = `a${icon}`;
  const code = {

    a11d: 'thunderstorm.svg',
    a11n: 'thunderstorm.svg',

    a10d: 'rain.svg',
    a10n: 'rain.svg',
    a09d: 'rain.svg',
    a09n: 'rain.svg',

    a13d: 'snow.svg',
    a13n: 'snow.svg',

    a50d: 'mist.svg',
    a50n: 'mist.svg',

    a01d: 'sunny.svg',
    a01n: 'sunny-night.svg',

    a02d: 'scattered-clouds.svg',
    a02n: 'scattered-clouds-night.svg',
    a03d: 'scattered-clouds.svg',
    a03n: 'scattered-clouds.svg',

    a04d: 'broken-clouds.svg',
    a04n: 'broken-clouds.svg',
  };

  skyIcon = code[id];
  console.log(skyIcon);
  return skyIcon;
}

// Current conditions & UI update
getWeather = async (url, zip, api) => {
  // const apiUrl = await postServer('/getWeather', { zip });
  const apiRes = `${url}${zip}&units=imperial&cnt=5&appid=${api}`;
  const fetchResponse = await fetch(apiRes);
  const obj = await fetchResponse.json();

  try {
    const userFeeling = document.querySelector('#feelings').value;
    const currentTemp = Math.round(obj.main.temp);
    const minTemp = Math.round(obj.main.temp_min);
    const maxTemp = Math.round(obj.main.temp_max);
    const icon = obj.weather[0].icon;
    const UNIX_timestamp = obj.dt;
    const date = timeConverter(UNIX_timestamp);
    const currentDate = date.time;
    const data = { currentTemp, icon, userFeeling, date };

    postServer('/api', { data }).then(response => {
      console.log(response);
    });

    document.querySelector('.temp').innerHTML = `${currentTemp}\u00B0`;
    document.querySelector('.date').innerHTML = currentDate;
    document.querySelector('#low').innerHTML = minTemp;
    document.querySelector('#hi').innerHTML = maxTemp;
    document.querySelector('.current-conditions').src = `images/${icons(icon)}`;

    return obj;
  } catch (error) {
    // throw error;
    // appropriately handle the error
    console.log('error', error);
  }
};

// Five day forcast & UI update
getForecast = async (lat, lon, api) => {
  // const res = await postServer('/getFiveDay', { lat, lon });
  const apiRes = `${fiveDayUrl}lat=${lat}&lon=${lon}&units=imperial&cnt=10&exclude=current,minutely,hourly&appid=${api}`;
  const fetchResponse = await fetch(apiRes);
  const data = await fetchResponse.json();

  let UNIX_timestamp;
  let minTemp;
  let maxTemp;
  let day;
  let sky;
  const length = 3;

  // Update forecast UI
  for (let i = 1; i <= 5; i++) {
    UNIX_timestamp = data.daily[i].dt;
    minTemp = Math.round(data.daily[i].temp.min);
    maxTemp = Math.round(data.daily[i].temp.max);
    day = timeConverter(UNIX_timestamp);
    sky = data.daily[i].weather[0].icon;
    const dayAb = day.result.substring(0, length);


    document.querySelector(`.day-${i}`).innerHTML = `${dayAb}:`;
    document.querySelector(`#day-${i}-conditions`).src = `images/${icons(sky)}`;
    document.querySelector(`.low-temp-day-${i}`).innerHTML = `L: ${minTemp}`;
    document.querySelector(`.high-temp-day-${i}`).innerHTML = `H: ${maxTemp}`;
  }
  return data;
}

// Previous entry
journal = async () => {
  const request = await fetch('/returnData');
  const journalData = await request.json();
  const pastTemp = journalData.data.currentTemp;
  const pastFeelings = journalData.data.userFeeling;
  const pastSky = journalData.data.icon;
  const datePast = journalData.data.date.time;
  document.querySelector('.response').innerHTML = pastFeelings;
  document.querySelector('.past-temp').innerHTML = `${pastTemp}\u00B0`;
  document.querySelector('.past-condition').src = `images/${icons(pastSky)}`;
  document.querySelector('.date-past').innerHTML = datePast;
}

//POST function 
postServer = async (url = '', data = {}) => {
  const resp = await fetch(url, {
    method: 'POST',
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  try {
    const response = await resp.json();
    console.log(response)
    return response;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}