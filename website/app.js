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

  var i = 0;
  // var data = { list: [ { dt: 1522666800 } ] };
  var data = { list: [{ dt: UNIX_timestamp }] };
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayNum = new Date(data.list[i].dt * 1000).getDay();
  var result = days[dayNum];
  // console.log(result);
  return result;
}

// Icon function
function icons(sky) {
  const condition = 8;
  let skyIcon = "images/thunderstorm.svg";
  for (let i = 0; i < condition; i++) {
    if (sky > 199 && sky < 233) {
      skyIcon = "images/thunderstorm.svg";
    } if (sky > 299 && sky < 323) {
      skyIcon = "images/rain.svg";
    } if (sky > 499 && sky < 532) {
      skyIcon = "images/rain.svg";
    } if (sky > 599 && sky < 623) {
      skyIcon = "images/snow.svg";
    } if (sky > 700 && sky < 782) {
      skyIcon = "images/mist.svg";
    } if (sky === 800) {
      skyIcon = "images/sunny.svg";
    } if (sky > 800 && sky < 803) {
      skyIcon = "images/scattered-clouds.svg";
    } if (sky > 802 && sky < 805) {
      skyIcon = "images/broken-clouds.svg";
    }
    // document.querySelector('.current-conditions').src = skyIcon;
    // }
    return skyIcon
  }
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
  document.querySelector('.current-conditions').src = icons(sky);
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
    console.log(dayAb);
    // console.log(sky);
    // console.log(i);
    // console.log(day);
    // console.log(minTemp);
    // console.log('.day-' + int);
    document.querySelector('.day-' + i).textContent = dayAb + ':';
    document.querySelector(`#day-${i}-conditions`).src = icons(sky);
    // document.querySelector('.day-' + i + 'conditions').src = icons(sky);
    document.querySelector('.low-temp-day-' + i).textContent = `L: ${minTemp}`;
    document.querySelector('.high-temp-day-' + i).textContent = `H: ${maxTemp}`;
  }
}