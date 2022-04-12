import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { City } from 'src/app/shared/models/city';

import { getCitiesHourly, getCitiesDaily } from '../store/selectors/'

import { select, Store } from '@ngrx/store'
import { State } from '../store/reducers';
import { addCityDaily, addCityHourly } from '../store/actions/city.actions';
import { WeatherForecastService } from '../shared/services/weather-forecast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchValue = '';
  selectedMode = 'hourly';
  modes = ['hourly', 'daily'];
  cities: Observable<City[]> | undefined;

  selectedCity: City | undefined;

  searchCityControl = new FormControl();

  displayedColumnsHourly: string[] = ['name'];
  displayedColumnsDaily: string[] = ['name'];

  citiesHourly$: Observable<City[]> | undefined;
  citiesHourly: City[] = []

  citiesDaily$: Observable<City[]> | undefined;
  citiesDaily: City[] = []

  constructor(private readonly store: Store<State>, private geolocationService: GeolocationService,
    private weatherForecastService: WeatherForecastService) {
  }

  ngOnInit(): void {
    this.searchCityControl.valueChanges.subscribe({
      next: value => {
        if (value) {
          this.cities = this._filter(value);
        }
      }
    });

    this.citiesHourly$ = this.store.pipe(select(getCitiesHourly));
    this.citiesDaily$ = this.store.pipe(select(getCitiesDaily));

    /*
    TODO: improve this
    (find a way to use async pipe when passing datasource to material table to avoid subscribing)
    */
    this.citiesHourly$.subscribe({
        next: values => {
          this.citiesHourly = values
        }
      });

      this.citiesDaily$.subscribe({
        next: values => {
          this.citiesDaily = values
        }
      })
  }

  private _filter(value: string): Observable<City[]> {
    const filterValue = value.toLowerCase();
    return this.geolocationService.searchCities(filterValue);
  }

  clearSearch() {
    this.searchCityControl.reset('');
  }

  onSelectCitySearchResult(city: City): void {
    if (this.selectedMode === 'hourly') {
      this.weatherForecastService.getHourlyWeatherForecast(city).subscribe({
        next: response => {
          this.displayedColumnsHourly = ['name'];
          const forecastData = this.getHourlyWeatherItems(response.hourly);
          //populate table headers
          const cityCopy: City = {...city}
          for (let i = 0; i < forecastData.length; i++) {
            const time = this.getTime(forecastData[i].dt);
            this.displayedColumnsHourly.push(time);
            // TODO: find a cleaner way to do this
            const key = `key${i}`;
            cityCopy[key] = forecastData[i].temp;
          }
          this.store.dispatch(addCityHourly({city: cityCopy}));
        },
        error: (err) => console.error(err)
      });
    } else {
      this.weatherForecastService.getDailyWeatherForecast(city).subscribe({
        next: response => {
          this.displayedColumnsHourly = ['name'];
          const forecastData = this.getDailyWeatherItems(response.daily);
          const cityCopy: City = {...city}
          //populate table headers
          for (let i = 0; i < forecastData.length; i++) {
            const dayOfWeek = this.getDayOfWeek(forecastData[i].dt);
            this.displayedColumnsDaily.push(dayOfWeek);
            // TODO: find a cleaner way to do this
            const key = `key${i}`;
            cityCopy[key] = forecastData[i].temp.max;
          }
          this.store.dispatch(addCityDaily({city: cityCopy}));
        },
        error: (err) => console.error(err)
      });
    }
  }


  getHourlyWeatherItems(arr: []): any[] {
    const result: [] = [];

    let counter = 3;
    for( let i = 0 ; i <= 7; i++ ) {
      result.push(arr[counter-1]);
      counter=counter+3;
    }
    return result;
  }

  getDailyWeatherItems(arr: []): any[] {
    return arr.slice(0, 7);
  }

  getTime(unixValue: number) {

    const date = new Date(unixValue * 1000);
    // Hours part from the timestamp
    const hours = date.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();

    // Will return time in 03:00 format
    const formattedTime = hours + ':' + minutes.substring(-2);

    return formattedTime;
  }

  getDayOfWeek(unixValue: number) {
    const date = new Date(unixValue * 1000);
    // Hours part from the timestamp
    const weekDay = date.getDay();

    switch (weekDay) {
      case 0: return 'su';
      case 1: return 'mo';
      case 2: return 'tu';
      case 3: return 'we';
      case 4: return 'th';
      case 5: return 'fr';
      case 6: return 'sa';
    }

    return '';
  }

  getColumnsToDisplay(columns: string[]) {
    const result = [...columns];
    result.splice(0, 1);
    return result;
  }
}
