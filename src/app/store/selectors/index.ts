import { createFeatureSelector, createSelector } from '@ngrx/store';
import { City } from 'src/app/shared/models/city';
import {State} from '../reducers/city.reducer';

export const getCityState = createFeatureSelector<State>('city');

export const getCitiesHourly = createSelector(
  getCityState,
  (state: State) => state.citiesHourly
);

export const getCitiesDaily = createSelector(
  getCityState,
  (state: State) => state.citiesDaily
);
