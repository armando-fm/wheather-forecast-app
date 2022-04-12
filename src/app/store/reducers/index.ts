import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromCity from './city.reducer';

export interface State {
  city: fromCity.State
}

export const reducers: ActionReducerMap<State> = {
  city: fromCity.cityReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
