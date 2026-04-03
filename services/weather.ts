import { fetchWeatherApi } from "openmeteo";

export async function getWeather(latitude: number, longitude: number, date?: Date) {
  if (!date) {
    const params = {
      latitude,
      longitude,
      current: ["temperature_2m", "surface_pressure"],
      daily: ["temperature_2m_min", "temperature_2m_max", "pressure_msl_min", "pressure_msl_max"],
      timezone: "auto",
      temperature_unit: "fahrenheit",
    };

    const url = "https://api.open-meteo.com/v1/forecast";

    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const current = response.current()!;
    const daily = response.daily()!;

    return {
      temperature: current.variables(0)!.value(),
      pressure: current.variables(1)!.value() * 0.02953,
      temp_min: daily.variables(0)!.valuesArray()![0],
      temp_max: daily.variables(1)!.valuesArray()![0],
      pressure_min: daily.variables(2)!.valuesArray()![0] * 0.02953,
      pressure_max: daily.variables(3)!.valuesArray()![0] * 0.02953,
    };
  }

  const formattedDate = date.toISOString().split("T")[0];

  const params = {
    latitude,
    longitude,
    start_date: formattedDate,
    end_date: formattedDate,
    hourly: ["temperature_2m", "surface_pressure"],
    timezone: "auto",
    temperature_unit: "fahrenheit",
  };

  const url = "https://archive-api.open-meteo.com/v1/archive";

  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const hourly = response.hourly()!;
  
  const tempArray = hourly.variables(0)!.valuesArray()!;
  const pressureArray = hourly.variables(1)!.valuesArray()!;

  const middayIndex = 12;

  return {
    temperature: tempArray[middayIndex],
    pressure: pressureArray[middayIndex] * 0.02953,
    // For historical/archive, just use current value as min/max (or compute min/max if you want)
    temp_min: tempArray[middayIndex],
    temp_max: tempArray[middayIndex],
    pressure_min: pressureArray[middayIndex] * 0.02953,
    pressure_max: pressureArray[middayIndex] * 0.02953,
  };
    
}
