export const environment = {
  production: true,
  // @ts-ignore
  openWeatherPubKey: window['env']['openWeatherPubKey'] || '',
  // @ts-ignore
  openWeatherApiBaseUrl: window['env']['openWeatherApiBaseUrl'] || 'https://api.openweathermap.org/data/2.5',
  // @ts-ignore
  openWeatherGeocodingApiBaseUrl: window['env']['openWeatherGeocodingApiBaseUrl'] || 'http://api.openweathermap.org/geo/1.0',
};
