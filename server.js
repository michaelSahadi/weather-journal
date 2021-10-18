// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');
const cors = require('cors');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Cors for cross origin allowance
app.use(cors());

app.use(express.static('website'))

const port = 3000;


const listening = () => {
  console.log('server running');
  console.log(`running onlocalhost: ${port}`);
}

const server = app.listen(port, listening);

let data = {};

// const addFeelings = (req, res) => {
//   console.log(req.body);
//   return res.send(data);
// }
app.get('/', (req, res) => {
  console.log('here');
  res.send('Hi');
});
// app.post('/getData', addFeelings);

app.post('/api', (req, res) => {
  console.log('Hello World');
  console.log(req);
  console.log(req.body);
  return res.send(data);
  console.log(data);
  res.send({ status: 'ok' });
})
