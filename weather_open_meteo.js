import { loadJSON } from "./utils_lib/utils_lib.js";

export function getWeather(date, callback) {
  loadJSON(
    `https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.57&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${date}&end_date=${date}`,
    callback,
  );
}

export function dataLoaded(data) {
  const dateTime = data.daily.time[0];
  const weatherCode = data.daily.weathercode[0];
  const maxTemp = data.daily.temperature_2m_max[0];
  const minTemp = data.daily.temperature_2m_min[0];
  const icon = wwCodes[weatherCode];
  console.log(`Dato: ${dateTime}`);
  console.log(`Weather: ${weatherCode}`);
  console.log(`Max: ${maxTemp}`);
  console.log(`Min: ${minTemp}`);
  console.log(`Icon: ${icon}`);
}

export const wwCodes = {
  0: "clearsky_day.png",
  1: "fair_day.png",
  2: "partlycloudy_day.png",
  3: "cloudy.png",
  45: "fog.png",
  48: "fog.png",
  // it's raining again👇🏼
  51: "lightrain.png",
  53: "lightrain.png",
  55: "lightrain.png",
  56: "lightsleet.png",
  57: "lightsleet.png",
  61: "lightrain.png",
  63: "rain.png",
  65: "heavyrain.png",
  66: "lightsleet.png",
  67: "lightsleet.png",
  71: "lightsnow.png",
  73: "snow.png",
  75: "heavysnow.png",
  77: "lightsnow.png",
  80: "lightrainshowers_day.png",
  81: "rainshowers_day.png",
  82: "heavyrainshowers_day.png",
  85: "lightsnowshowers_day.png",
  86: "heavysnowshowers_day.png",
  95: "rainandthunder.png",
  96: "rainandthunder.png",
  99: "rainandthunder.png",
};

export function badWeather(code) {
  return (
    (code >= 51 && code <= 67) || // WMO Weather interpretation codes
    (code >= 80 && code <= 82) ||
    (code >= 96 && code <= 99)
  );
}

//Weather variable documentation
// WMO Weather interpretation codes (WW)
// Code	Description
// 0	Clear sky
// 1, 2, 3	Mainly clear, partly cloudy, and overcast
// 45, 48	Fog and depositing rime fog
// 51, 53, 55	Drizzle: Light, moderate, and dense intensity
// 56, 57	Freezing Drizzle: Light and dense intensity
// 61, 63, 65	Rain: Slight, moderate and heavy intensity
// 66, 67	Freezing Rain: Light and heavy intensity
// 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
// 77	Snow grains
// 80, 81, 82	Rain showers: Slight, moderate, and violent
// 85, 86	Snow showers slight and heavy
// 95 *	Thunderstorm: Slight or moderate
// 96, 99 *	Thunderstorm with slight and heavy hail
// (*) Thunderstorm forecast with hail is only available in Central Europe
