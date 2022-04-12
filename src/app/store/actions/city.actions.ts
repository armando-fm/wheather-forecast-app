import { createAction, props } from '@ngrx/store';
import { City } from 'src/app/shared/models/city';

export const addCityHourly = createAction(
  '[City Hourly] Add City',
  props<{ city: City}>()
);


export const addCityDaily = createAction(
  '[City Daily] Add City',
  props<{ city: City}>()
);
