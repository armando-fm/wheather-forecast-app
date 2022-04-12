import { Action, createReducer, on } from '@ngrx/store';
import { City } from 'src/app/shared/models/city';
import * as CityActions from '../actions/city.actions';

export interface State {
  citiesDaily: City[];
  citiesHourly: City[];
}

export const initialState: State = {
  citiesDaily: [],
  citiesHourly: [],
};

export const cityReducer = createReducer(
  initialState,
  on(CityActions.addCityDaily, (state, {city}) => ({...state, citiesDaily: [...state.citiesDaily, city]})),
  on(CityActions.addCityHourly, (state, {city}) => ({...state, citiesHourly: [...state.citiesHourly, city]})),
);

export const cityFeatureKey = 'city';
