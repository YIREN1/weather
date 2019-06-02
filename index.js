const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Datastore = require('nedb')
  , db = new Datastore('database.db');
const fetch = require('node-fetch');
db.loadDatabase();

const app = express();


app.use(express.static('public'));
// app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/store', (req, res) => {
  console.log('I got a req');
  const timeStamp = Date.now();
  const data = req.body;
  data.timeStamp = timeStamp;
  db.insert(data);
  res.json({ data });
});

app.get('/data', (req, res) => {
  db.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
      return;
    }
    res.json(data);
  });

});

app.get('/weather/:lat/:lon', async (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;
  const api_key = process.env.API_KEY;
  const weatherURL = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
  const aqURL = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;

  // Promise.all([
  //   fetch(weatherURL),
  //   fetch(aqURL),
  // ])
  // .then((weatherResponse, aqResponse) => {
  //   return Promise.all([
  //     weatherResponse.json(),
  //     aqResponse.json(),
  //   ])
  // })
  // .then((weatherData, aqData) => {
  //   const data = { weatherData, aqData };
  //   res.json(data);
  // })
  const weatherResponse = await fetch(weatherURL);
  const weatherData = await weatherResponse.json();

  const aqResponse = await fetch(aqURL);
  const aqData = await aqResponse.json();

  const data = { weatherData, aqData };
  res.json(data);
})

const port = 8000;

app.listen(port, () => console.log(`server running at ${port}`));