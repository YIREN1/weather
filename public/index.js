
let sendPost;
function setup() {
  noCanvas();
  //   const video = createCapture(VIDEO);
  //   video.size(160,120);
  if ('geolocation' in navigator) {
    console.log('geo ava');
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat, lon , weather, mood, air;
      try {
        console.log(position.coords);
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longtitude').textContent = lon;
        const weatherURL = `/weather/${lat}/${lon}`;
        const response = await fetch(weatherURL);
        const json = await response.json();
        console.log(json);
        weather = json.weatherData.currently;
        weather.timezone = json.weatherData.timezone;
        air = json.aqData.results[0].measurements[0];
        document.getElementById('summary').textContent = weather.summary;
        document.getElementById('timezone').textContent = json.weatherData.timezone;

        document.getElementById('aq_units').textContent = air.unit;
        document.getElementById('aq_param').textContent = air.parameter;
        document.getElementById('aq_value').textContent = air.value;
        document.getElementById('aq_date').textContent = air.lastUpdated;
        document.getElementById('temperature').textContent = weather.temperature;

      } catch (err) {
        air = { value: -1 };
        console.error(err, 'something went wrong');
        document.getElementById('aq_value').textContent = 'NO available air info ';
      }

      sendPost = async () => {
        const mood = document.getElementById('mood').value;
        //   video.loadPixels();
        //   const image64 = video.canvas.toDataURL();
        const data = {
          lat,
          lon,
          mood,
          weather,
          air,
          //   image64,
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        }

        const res = await fetch('/store', options);
        const resData = await res.json();
        console.log(resData);
      }
      sendPost();
    })
  } else {
    console.log('geo not ava');
  }

}

// function draw() {
//   ellipse(50, 50, 80, 80);
// }