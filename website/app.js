let apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?zip=';
let apiKey = '&appid=49dd336c6342a0fbf7eba30d6af0f432'


// const input = document.getElementById("input-zip");
// input.addEventListener("keyup", function (event) {
//   if (event.keyCode === 13) {
//     event.preventDefault();
//     document.getElementById(".submit").click();
//     getWeather(apiUrl, userZip, apiKey);
//   }
// });

function getInputValue() {
  const userZip = document.querySelector('#zip').value;
  console.log(userZip);
  console.log(apiUrl);
  getWeather(apiUrl, userZip, apiKey);
}

function convert(temp) {
  return Math.round((temp - 273.15) * 1.8) + 32;
}

const getWeather = async (apiUrl, userZip, apiKey) => {
  const res = await fetch(`${apiUrl}${userZip}${apiKey}`)
  try {
    const obj = await res.json();
    console.log(obj);
    let currentTemp = obj.list[0].main.temp;
    let minTemp = obj.list[0].main.temp_min;
    let maxTemp = obj.list[0].main.temp_max;
    let sky = obj.list[0].weather[0].id;
    let skyIcon = "images/thunderstorm.svg";
    const condition = 8;
    let fah = Math.round((currentTemp - 273.15) * 1.8) + 32;
    let minT = Math.round((minTemp - 273.15) * 1.8) + 32;
    let maxT = Math.round((maxTemp - 273.15) * 1.8) + 32;


    document.querySelector('.current-temp').textContent = fah;
    document.querySelector('#low').textContent = minT;
    document.querySelector('#hi').textContent = maxT;

    function fiveDay() {

    }

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
      document.querySelector('.current-conditions').src = skyIcon;
    }

    for (let i = 0; i < 40; i++) {
      let fiveDay = []
      fiveDay.push = obj.list[i].dt_txt;
      console.log(fiveDay);
    }

  } catch (error) {
    // throw error;
    // appropriately handle the error
    console.log("error", error);
  }
}


