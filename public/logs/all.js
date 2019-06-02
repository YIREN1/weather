var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoieXJlbjExIiwiYSI6ImNqd2V4ZGFzbTA2MzI0M3A1cThoMHBva2wifQ.L91Ogex3-xexmGdKCcrXeQ'
}).addTo(mymap);

const getData = async () => {
  const res = await fetch('/data');
  const data = await res.json();
  console.log(data);

  for (item of data) {
    var marker = L.marker([item.lat, item.lon]).addTo(mymap);
    const weather = item.weather;
    const air = item.air;
    let txt = `<p>
    latitude: <span id="latitude">${item.lat}</span>&deg;<br />
    longtitude: <span id="longtitude">${item.lon}</span>&deg;<br />
    weather in <span id="timezone">${weather.timezone}</span>: 
    <span id="summary">${weather.summary}</span>
    <span id="temperature">${weather.temperature}</span>&deg; Celsius.`;

    const meg = 
    `The concentration of particulate matter <span id="aq_param">${air.parameter}</span>
    is <span id="aq_value">${air.value}</span> <span id="aq_units">${air.unit}</span> last reads
    on <span id="aq_date">${air.latUpdated}</span>
  </p>`;
  
    if (item.air.value === -1) {
      txt += 'No air quality detected';
    } else {
      txt += meg;
    }
    
    marker.bindPopup(txt);

    const root = document.createElement('p');
    const mood = document.createElement('div');
    const geo = document.createElement('div');
    const date = document.createElement('div');
    const image = document.createElement('img');
    mood.textContent = `mood: ${item.mood}`;

    geo.textContent = `latitude: ${item.lat}  longtitude: ${item.lon}`;

    const dateString = new Date(item.timeStamp).toLocaleString();
    date.textContent = dateString;

    // image.src = item.image64;
    // image.alt = 'Selfie...'

    root.append(mood, geo, date, image);
    document.body.append(root);
  }
}
getData();


