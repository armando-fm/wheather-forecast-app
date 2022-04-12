import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private url = `${environment.openWeatherGeocodingApiBaseUrl}`;
  private apiKey = `${environment.openWeatherPubKey}`;

  constructor(private http: HttpClient) { }

  searchCities(query: string) : Observable<City[]> {
    return this.http.get<City[]>(`${this.url}/direct?q=${query}&limit=1&appid=${this.apiKey}`);
  }
}
