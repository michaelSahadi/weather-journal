// const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
// const apiKey = '49dd336c6342a0fbf7eba30d6af0f432';
const input = document.querySelector('#zip');
const buttonInput = document.querySelector('.submit');
// const fiveDayUrl = 'http://api.openweathermap.org/data/2.5/onecall?';

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
// Click event for the submit button
// buttonInput.addEventListener('click', function getInputValue() {
//   const userZip = document.querySelector('#zip').value;
//   getWeather(apiUrl, userZip, apiKey);
// });



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
  // console.log(date);
  const i = 0;
  const data = { list: [{ dt: UNIX_timestamp }] };
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNum = new Date(data.list[i].dt * 1000).getDay();
  const result = days[dayNum];
  // console.log(data);
  // console.log(result);
  return result;
};

// Icon function
const icons = (sky) => {
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
  return skyIcon;
}

// Current conditions & UI update
const getWeather = async (zip) => {
  const apiUrl = await postServer('/getWeather', { zip });
  try {
    const obj = apiUrl;
    const userFeeling = document.querySelector('#feelings').value;
    const lon = obj.coord.lon;
    const lat = obj.coord.lat;
    const cord = { lat, lon }
    const currentTemp = Math.round(obj.main.temp);
    const minTemp = Math.round(obj.main.temp_min);
    const maxTemp = Math.round(obj.main.temp_max);
    const sky = obj.weather[0].id;

    document.querySelector('.current-temp').textContent = `${currentTemp}\u00B0`;
    document.querySelector('#low').textContent = minTemp;
    document.querySelector('#hi').textContent = maxTemp;
    document.querySelector('.current-conditions').src = `images/${icons(sky)}`;

    const data = { currentTemp, sky, userFeeling };
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    // // console.log(options);
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
  // console.log('hello');
  try {
    const data = res;
    for (let i = 1; i <= 6; i++) {
      const UNIX_timestamp = data.daily[i].dt;
      const minTemp = Math.round(data.daily[i].temp.min);
      const maxTemp = Math.round(data.daily[i].temp.max);
      const day = timeConverter(UNIX_timestamp);
      const sky = data.daily[i].weather[0].id;
      const length = 3;
      const dayAb = day.substring(0, length);

      document.querySelector(`.day-${i}`).textContent = `${dayAb}:`;
      document.querySelector(`#day-${i}-conditions`).src = `images/${icons(sky)}`;
      document.querySelector(`.low-temp-day-${i}`).textContent = `L: ${minTemp}`;
      document.querySelector(`.high-temp-day-${i}`).textContent = `H: ${maxTemp}`;
    }
  } catch (error) {
    // throw error;
    // appropriately handle the error
    console.log('error', error);
  }
}

const journal = async () => {
  const request = await fetch('/returnData');
  console.log(request);
  try {
    const journalData = await request.json();
    const pastTemp = journalData.currentTemp;
    const pastFeelings = journalData.userFeeling;
    const pastSky = journalData.sky;
    console.log(pastTemp);
    // console.log(journalData);

    document.querySelector('.response').textContent = pastFeelings;
    document.querySelector('.past-temp').textContent = `${pastTemp}\u00B0`;
    document.querySelector('.past-condition').src = `images/${icons(pastSky)}`;
    // detailsDiv.classList.add('entryHolder');
    // cityContent.innerHTML = weatherData.thecity;
    // dateContent.innerHTML = `Today\'s date: ${weatherData.date}`;
    // mainContent.innerHTML = `Type of Weather: ${weatherData.main}`;
    // tempContent.innerHTML = `The temperature is ${weatherData.temp}°C`;
    // feelingContent.innerHTML = `I\'m feeling ${weatherData.feeling}`;
  } catch (error) {
    console.log('The UI could not be updated', error);
  }
}



const postServer = async (url = '', data = {}) => {
  // console.log(data);
  // console.log(url);
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