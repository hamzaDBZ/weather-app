export async function getWeather(city, unit) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=U6EUMN7RVFQNX4TATGEL5QDFM`,
  );
  const weatherData = await response.json();
  const processedweatherData = getProcessedWeatherData(weatherData);
  return processedweatherData;
}

function getProcessedWeatherData(weatherData) {
  const {
    humidity,
    conditions,
    feelslike,
    windspeed,
    temp,
    sunrise,
    sunset,
    icon,
    datetime,
  } = weatherData.currentConditions;
  const { timezone } = weatherData;

  return {
    humidity,
    conditions,
    feelslike,
    windspeed,
    temp,
    sunrise,
    sunset,
    icon,
    datetime,
    timezone,
  };
}
