import "../css/styles.css";

function cacheDOM() {
  const form = document.querySelector("form");
  const locationInput = document.querySelector("input#location");
  const metricRadio = document.querySelector("#C");
  const usRadio = document.querySelector("#F");
  const city = document.querySelector(".city");
  const temp = document.querySelector(".temp");
  const icon = document.createElement("img");
  const conditions = document.querySelector(".conditions");
  const feelsLike = document.querySelector(".feels-like span");
  const datetime = document.querySelector(".datetime");
  const humidity = document.querySelector(".humidity span");
  const windSpeed = document.querySelector(".wind-speed span");
  const windSpeedUnit = document.querySelector(".wind-speed span.unit");
  const sunrise = document.querySelector(".sunrise span");
  const sunset = document.querySelector(".sunset span");

  return {
    form,
    locationInput,
    metricRadio,
    usRadio,
    city,
    temp,
    icon,
    conditions,
    feelsLike,
    datetime,
    humidity,
    windSpeed,
    windSpeedUnit,
    sunrise,
    sunset,
  };
}

function todayDate(datetime, timeZone) {
  const date = new Date(
    new Intl.DateTimeFormat("en-US", { timeZone }).format(),
  );
  const fullHour = datetime.slice(0, 5);
  const hour = fullHour.slice(0, 2);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${date.toDateString()} ${(hour > 12 ? hour - 12 : hour).toString().padStart(2, 0)}:${fullHour.slice(3, 5).padStart(2, 0)} ${ampm}`;
}

async function createLoading() {
  const img = document.createElement("img");
  await import("../icons/loading.gif").then(
    (module) => (img.src = module.default),
  );
  img.alt = "loading";
  const loading = document.createElement("div");
  loading.className = "loading";
  loading.appendChild(img);
  document.body.appendChild(loading);
  return loading;
}

async function handleWeather(e = null) {
  if (e) e.preventDefault();
  const loading = createLoading();
  const city = DOM.locationInput.value ? DOM.locationInput.value : "Casablanca";
  const unit = DOM.metricRadio.checked ? "metric" : "us";
  let weatherData;
  await import("./weatherLogic.js").then(async (module) => {
    weatherData = await module.getWeather(city, unit);
  });

  DOM.city.textContent = city[0].toUpperCase() + city.slice(1).toLowerCase();
  DOM.temp.textContent = `${weatherData.temp.toFixed()}°${unit === "metric" ? "C" : "F"}`;
  DOM.conditions.textContent = weatherData.conditions;
  DOM.feelsLike.textContent = `${weatherData.feelslike.toFixed()}°${unit === "metric" ? "C" : "F"}`;
  DOM.datetime.textContent = todayDate(
    weatherData.datetime,
    weatherData.timezone,
  );
  DOM.humidity.textContent = `${weatherData.humidity.toFixed()}%`;
  DOM.windSpeed.textContent = weatherData.windspeed.toFixed();
  DOM.windSpeedUnit.textContent = unit === "metric" ? "km/h" : "mph";
  DOM.windSpeed.append(DOM.windSpeedUnit);
  DOM.sunrise.textContent = weatherData.sunrise.toString().slice(0, 5);
  DOM.sunset.textContent = weatherData.sunset.toString().slice(0, 5);
  await import(`../icons/${weatherData.icon}.png`).then(
    (icon) => (DOM.icon.src = icon.default),
  );
  DOM.icon.alt = weatherData.icon;
  document.querySelector(".weather-info").prepend(DOM.icon);
  loading.then((element) => element.remove());
}

const DOM = cacheDOM();
DOM.form.addEventListener("submit", handleWeather);

handleWeather();
