const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '49dd336c6342a0fbf7eba30d6af0f432';
const input = document.querySelector('#zip');
const buttonInput = document.querySelector('.submit');
const fiveDayUrl = 'http://api.openweathermap.org/data/2.5/onecall?';
// Event for the Enter key
input.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    const userZip = document.querySelector('#zip').value;
    getWeather(apiUrl, userZip, apiKey);
    // getForecast(fiveDayUrl, userZip, apiKey);
  }
});

// Convert Unix time code to something a Humon can read
function timeConverter(UNIX_timestamp) {
  // let a = new Date(UNIX_timestamp * 1000);
  // let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // let year = a.getFullYear();
  // let month = months[a.getMonth()];
  // let date = a.getDate();
  // let hour = a.getHours();
  // let min = a.getMinutes();
  // let sec = a.getSeconds();
  // let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;

  const i = 0;
  const data = { list: [{ dt: UNIX_timestamp }] };
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNum = new Date(data.list[i].dt * 1000).getDay();
  const result = days[dayNum];
  return result;
};

// Icon function
function icons(sky) {
  const condition = 8;
  let skyIcon = "images/thunderstorm.svg";
  const id = `a${sky}`;
  const code = {
    a200: 'thunderstorm.svg',
    a201: 'thunderstorm.svg',
    a202: 'thunderstorm.svg',
    a210: 'thunderstorm.svg',
    a211: 'thunderstorm.svg',
    a212: 'thunderstorm.svg',
    a221: 'thunderstorm.svg',
    a230: 'thunderstorm.svg',
    a231: 'thunderstorm.svg',
    a232: 'thunderstorm.svg',

    a300: 'rain.svg',
    a301: 'rain.svg',
    a302: 'rain.svg',
    a310: 'rain.svg',
    a311: 'rain.svg',
    a312: 'rain.svg',
    a313: 'rain.svg',
    a314: 'rain.svg',
    a321: 'rain.svg',
    a500: 'rain.svg',
    a501: 'rain.svg',
    a502: 'rain.svg',
    a503: 'rain.svg',
    a504: 'rain.svg',
    a511: 'rain.svg',
    a520: 'rain.svg',
    a521: 'rain.svg',
    a522: 'rain.svg',
    a531: 'rain.svg',

    a600: 'snow.svg',
    a601: 'snow.svg',
    a602: 'snow.svg',
    a611: 'snow.svg',
    a612: 'snow.svg',
    a613: 'snow.svg',
    a615: 'snow.svg',
    a616: 'snow.svg',
    a620: 'snow.svg',
    a621: 'snow.svg',
    a622: 'snow.svg',

    a701: 'mist.svg',
    a711: 'mist.svg',
    a721: 'mist.svg',
    a731: 'mist.svg',
    a741: 'mist.svg',
    a751: 'mist.svg',
    a761: 'mist.svg',
    a762: 'mist.svg',
    a771: 'mist.svg',
    a781: 'mist.svg',

    a800: 'sunny.svg',

    a801: 'scattered-clouds.svg',
    a802: 'scattered-clouds.svg',

    a803: 'broken-clouds.svg',
    a804: 'broken-clouds.svg',
  };
  skyIcon = code[id];
  return skyIcon
}


// Click event for the submit button
buttonInput.addEventListener('click', function getInputValue() {
  const userZip = document.querySelector('#zip').value;
  getWeather(apiUrl, userZip, apiKey);
});

// Grab current conditions
const getWeather = async (apiUrl, userZip, apiKey) => {
  const res = await fetch(`${apiUrl}${userZip}&units=imperial&cnt=5&appid=${apiKey}`)

  // try {
  const obj = await res.json();
  console.log(obj);
  const lon = obj.coord.lon;
  const lat = obj.coord.lat;
  console.log(lon, lat);
  let currentTemp = Math.round(obj.main.temp);
  let minTemp = Math.round(obj.main.temp_min);
  let maxTemp = Math.round(obj.main.temp_max);
  let sky = obj.weather[0].id;

  getForecast(fiveDayUrl, lat, lon, apiKey)

  document.querySelector('.current-temp').textContent = currentTemp;
  document.querySelector('#low').textContent = minTemp;
  document.querySelector('#hi').textContent = maxTemp;
  console.log(`ìmages/${icons(sky)}`);
  document.querySelector('.current-conditions').src = 'images/' + icons(sky);
}
// } catch (error) {
//   // throw error;
//   // appropriately handle the error
//   console.log("error", error);
// }


const getForecast = async (fiveDayUrl, lat, lon, apiKey) => {
  const res2 = await fetch(`${fiveDayUrl}lat=${lat}&lon=${lon}&units=imperial&cnt=5&exclude=current,minutely,hourly&appid=${apiKey}`)
  const data = await res2.json();
  console.log(data);

  for (let i = 1; i <= 6; i++) {
    let UNIX_timestamp = data.daily[i].dt;
    let minTemp = Math.round(data.daily[i].temp.min);
    let maxTemp = Math.round(data.daily[i].temp.max);
    // console.log(timeConverter(UNIX_timestamp));
    let day = timeConverter(UNIX_timestamp);
    const length = 3;
    let sky = data.daily[i].weather[0].id;
    const dayAb = day.substring(0, length);

    document.querySelector('.day-' + i).textContent = dayAb + ':';
    document.querySelector(`#day-${i}-conditions`).src = 'images/' + icons(sky);
    // document.querySelector('.day-' + i + 'conditions').src = icons(sky);
    document.querySelector(`.low-temp-day-${i}`).textContent = `L: ${minTemp}`;
    document.querySelector(`.high-temp-day-${i}`).textContent = `H: ${maxTemp}`;
  }
}