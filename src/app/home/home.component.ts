import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { City } from 'src/app/shared/models/city';

import { getCitiesHourly } from '../store/selectors/'

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

  citiesHourly$: Observable<City[]> | undefined;
  citiesHourly: City[] = []

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

    /*
    TODO: improve this
    (find a way to use async pipe when passing datasource to material table to avoid subscribing)
    */
    this.citiesHourly$.subscribe({
        next: values => {
          this.citiesHourly = values
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
          const forecastData = this.getXStepsItems(response.hourly);

          //populate table headers
          for (let i = 0; i < forecastData.length; i++) {
            const time = this.formatTime(forecastData[i].dt);
            this.displayedColumnsHourly.push(time);
            // TODO: find a cleaner way to do this
            const key = `key${i}`;
            // @ts-ignore
            city[key] = forecastData[i].temp;
          }

          this.store.dispatch(addCityHourly({city}));
        },
        error: (err) => console.error(err)
      });
    } else {
      // TODO: call api and store city with respective weather forecast
      this.store.dispatch(addCityDaily({city}))
    }
  }


  getXStepsItems(arr: []): any[] {
    const result: [] = [];

    let counter = 3;
    for( let i = 0 ; i <= 7; i++ ) {
      result.push(arr[counter-1]);
      counter=counter+3;
    }
    return result;
  }

  formatTime(unixValue: number) {

    const date = new Date(unixValue * 1000);
    // Hours part from the timestamp
    const hours = date.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();

    // Will return time in 03:00 format
    const formattedTime = hours + ':' + minutes.substring(-2);

    return formattedTime;
  }

  getColumnsToDisplay(columns: string[]) {
    const result = [...columns];
    result.splice(0, 1);
    return result;
  }
}
