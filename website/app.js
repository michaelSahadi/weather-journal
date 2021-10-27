const input = document.querySelector('#zip');
const buttonInput = document.querySelector('.submit');
const entryHolder = document.querySelector('.entryHolder');
const current = document.querySelector('.current');

// Enter key and Click event
input.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('generate').click();
  }
});

// Grab data
document.getElementById('generate').onclick = function () {
  const zip = document.querySelector('#zip').value;
  // getWeather(apiUrl, userZip, apiKey)
  getWeather(zip)
    .then(function (obj) {
      const lon = obj.coord.lon;
      const lat = obj.coord.lat;
      getForecast(lat, lon)
      // console.log('yo');
    })
    .then(
      journal()
    )
}

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
  // console.log(data);
  // console.log(result);
  return stuff;
};

// Icon function
const icons = (icon) => {
  let skyIcon = "images/thunderstorm.svg";
  const id = `a${icon}`;
  const code = {

    a11d: 'thunderstorm.svg',

    a09d: 'rain.svg',
    a10d: 'rain.svg',
    a13d: 'rain.svg',
    a09d: 'rain.svg',

    a13d: 'snow.svg',

    a50d: 'mist.svg',

    a01d: 'sunny.svg',
    a01n: 'sunny-night.svg',

    a02d: 'scattered-clouds.svg',
    a02n: 'scattered-clouds-night.svg',
    a03d: 'scattered-clouds.svg',

    a04d: 'broken-clouds.svg',
    a04n: 'broken-clouds.svg',
  };

  skyIcon = code[id];
  console.log(skyIcon);
  return skyIcon;
}

// Current conditions & UI update
const getWeather = async (zip) => {
  const apiUrl = await postServer('/getWeather', { zip });
  try {
    const obj = apiUrl;
    console.log(obj);
    const userFeeling = document.querySelector('#feelings').value;
    const lon = obj.coord.lon;
    const lat = obj.coord.lat;
    const cord = { lat, lon }
    const currentTemp = Math.round(obj.main.temp);
    const minTemp = Math.round(obj.main.temp_min);
    const maxTemp = Math.round(obj.main.temp_max);
    const sky = obj.weather[0].id;
    const icon = obj.weather[0].icon;
    console.log(icon);
    const UNIX_timestamp = obj.dt;
    const date = timeConverter(UNIX_timestamp);
    const currentDate = date.time;

    document.querySelector('.temp').textContent = `${currentTemp}\u00B0`;
    document.querySelector('.date').textContent = currentDate;
    document.querySelector('#low').textContent = minTemp;
    document.querySelector('#hi').textContent = maxTemp;
    document.querySelector('.current-conditions').src = `images/${icons(icon)}`;
    const data = { currentTemp, icon, userFeeling, date };
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    // postServer('/api', { data });
    fetch('/api', options);

    return obj;
  } catch (error) {
    // throw error;
    // appropriately handle the error
    console.log('error', error);
  }
};

// Five day forcast & UI update
const getForecast = async (lat, lon,) => {
  const res = await postServer('/getFiveDay', { lat, lon });
  // const map = await postServer('/map', { lat, lon });
  console.log(res);

  const data = res;
  for (let i = 1; i <= 6; i++) {
    const UNIX_timestamp = data.daily[i].dt;
    const minTemp = Math.round(data.daily[i].temp.min);
    const maxTemp = Math.round(data.daily[i].temp.max);
    const day = timeConverter(UNIX_timestamp);
    const sky = data.daily[i].weather[0].icon;
    const length = 3;
    // const dayAb = day.substring(0, length);
    const dayAb = day.result.substring(0, length);
    console.log(dayAb);
    document.querySelector(`.day-${i}`).textContent = `${dayAb}:`;
    document.querySelector(`#day-${i}-conditions`).src = `images/${icons(sky)}`;
    document.querySelector(`.low-temp-day-${i}`).textContent = `L: ${minTemp}`;
    document.querySelector(`.high-temp-day-${i}`).textContent = `H: ${maxTemp}`;
    // document.querySelector('.map').textContent = map;
  }
}

const journal = async () => {
  const request = await fetch('/returnData');
  console.log(request);

  const journalData = await request.json();
  const pastTemp = journalData.currentTemp;
  const pastFeelings = journalData.userFeeling;
  const pastSky = journalData.icon;
  const datePast = journalData.date.time;
  // console.log(datePast);
  // console.log(journalData);
  document.querySelector('.response').textContent = pastFeelings;
  document.querySelector('.past-temp').textContent = `${pastTemp}\u00B0`;
  document.querySelector('.past-condition').src = `images/${icons(pastSky)}`;
  document.querySelector('.date-past').textContent = datePast;
}


const postServer = async (url = '', data = {}) => {
  const resp = await fetch(url, {
    method: 'POST',
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  try {
    // console.log(resp)
    const response = await resp.json();
    console.log(response)
    return response;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}