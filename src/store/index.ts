import {applyMiddleware, createStore, Store} from 'redux';
import {rootReducer, IAppState} from './rootReducers';

import thunk from 'redux-thunk';

export default function configureStore(): Store<IAppState, any> {
  return createStore(rootReducer, undefined, applyMiddleware(thunk));
}

export const store = configureStore();
