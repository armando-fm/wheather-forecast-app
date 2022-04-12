import { createFeatureSelector, createSelector } from '@ngrx/store';
import { City } from 'src/app/shared/models/city';
import {State} from '../reducers/city.reducer';

export const getCityState = createFeatureSelector<State>('city');

export const getCitiesHourly = createSelector(
  getCityState,
  (state: State) => state.citiesHourly
);


// export interface CityFeatureState {
//   citiesHourly: City[];
//   citiesDaily: City[];
// }

// export interface AppState {
//   citiesFeature: CityFeatureState;
// }


// export const selectFeatureCitiesDaily = (state: AppState) => state.citiesFeature.citiesDaily;
// export const selectFeatureCitiesHourly = (state: AppState) => state.citiesFeature.citiesHourly;
