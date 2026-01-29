import { fetchWeatherApi } from "openmeteo";

export async function getWeather(latitude: number, longitude: number) {
  const params = {
    latitude,
    longitude,
    current: ["temperature_2m", "surface_pressure"],
    timezone: "auto",
    temperature_unit: "fahrenheit", // Fahrenheit
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!; // get current weather

  return {
    temperature: current.variables(0)!.value(), // number
    pressure: current.variables(1)!.value(),    // number
  };
}
