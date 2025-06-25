const apiKey = "718d21639880483c94e153835252506";

async function getWeather(city) {
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
  );

  if (!response.ok) return;

  let data = await response.json();
  displayCurrent(data.location, data.current);
  displayForecast(data.forecast.forecastday);
}

document.getElementById("search").addEventListener("input", (e) => {
  let city = e.target.value.trim();
  if (city.length >= 2) {
    getWeather(city);
  }
});

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function displayCurrent(location, current) {
  const date = new Date(current.last_updated.replace(" ", "T"));

  let html = `
    <div class="today forecast">
      <div class="forecast-header" id="today">
        <div class="day">${days[date.getDay()]}</div>
        <div class="date">${date.getDate()} ${months[date.getMonth()]}</div>
      </div>
      <div class="forecast-content" id="current">
        <div class="location">${location.name}</div>
        <div class="degree">
          <div class="num">${current.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="https:${current.condition.icon}" alt="" width="90" />
          </div>
        </div>
        <div class="custom">${current.condition.text}</div>
        <span><img src="images/icon-umberella.png" alt="">20%</span>
        <span><img src="images/icon-wind.png" alt="">${current.wind_kph} km/h</span>
        <span><img src="images/icon-compass.png" alt="">${current.wind_dir}</span>
      </div>
    </div>
  `;

  document.getElementById("forecast").innerHTML = html;
}

function displayForecast(forecastDays) {
  let html = "";
  for (let i = 1; i < forecastDays.length; i++) {
    let day = new Date(forecastDays[i].date);
    html += `
      <div class="forecast">
        <div class="forecast-header">
          <div class="day">${days[day.getDay()]}</div>
        </div>
        <div class="forecast-content">
          <div class="forecast-icon">
            <img src="https:${forecastDays[i].day.condition.icon}" alt="" width="48" />
          </div>
          <div class="degree">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div>
          <small>${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
          <div class="custom">${forecastDays[i].day.condition.text}</div>
        </div>
      </div>
    `;
  }

  document.getElementById("forecast").innerHTML += html;
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "718d21639880483c94e153835252506";
      let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`);
      let data = await res.json();
      displayCurrent(data.location, data.current);
      displayForecast(data.forecast.forecastday);
    },
    function (error) {
      console.log("Geolocation error:", error);
      getWeather("Cairo"); 
    }
  );
} else {
  getWeather("Cairo"); 
}
