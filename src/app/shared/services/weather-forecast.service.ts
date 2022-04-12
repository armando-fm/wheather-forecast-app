import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {

  private url = `${environment.openWeatherApiBaseUrl}`;
  private apiKey = `${environment.openWeatherPubKey}`;

  constructor(private http: HttpClient) { }

  getHourlyWeatherForecast(city: City): Observable<any>  {
    return this.http.get(`${this.url}/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${this.apiKey}`)
  }

  getDailyWeatherForecast(city: City): Observable<any>  {
    return this.http.get(`${this.url}/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${this.apiKey}`)
  }
}
