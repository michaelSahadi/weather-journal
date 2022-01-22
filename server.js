// Express to run server and routes
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');


// Start up an instance of app
const app = express();

/* Dependencies */
const cors = require('cors');
const { json } = require('express');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Cors for cross origin allowance
app.use(cors());

app.use(express.static('website'))

const port = process.env.PORT || 3000;


const listening = () => {
  console.log('server running');
  console.log(`running onlocalhost: ${port}`);
}

const server = app.listen(port, listening);

let projectData = {};

// Hide the api on server
// const weatherApi = async (req, res) => {
//   const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
//   const { zip } = req.body;
//   const apiRes = `${apiUrl}${zip}&units=imperial&cnt=5&appid=${apiKey}`;
//   const fetchResponse = await fetch(apiRes);
//   const obj = await fetchResponse.json();
//   return res.send(obj);
// };

// app.post('/getWeather', weatherApi);

// const fiveDayApi = async (req, res) => {
//   console.log(req.body);
//   const fiveDayUrl = 'http://api.openweathermap.org/data/2.5/onecall?';
//   const { lat } = req.body;
//   const { lon } = req.body;
//   const apiRes = `${fiveDayUrl}lat=${lat}&lon=${lon}&units=imperial&cnt=10&exclude=current,minutely,hourly&appid=${apiKey}`;
//   const fetchResponse = await fetch(apiRes);
//   const obj = await fetchResponse.json();
//   return res.send(obj);
// };

// app.post('/getFiveDay', fiveDayApi);

// POST request
const postData = (req, res) => {
  projectData = req.body;
  // console.log(projectData);
  res.json({
    status: 'success'
  })
};

app.post('/api', postData)

// GET request
const getData = (req, res) => {
  console.log('sending info');
  console.log(projectData);
  return res.send(projectData);
};

app.get('/returnData', getData);