import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import reducers, { blacklist } from './reducers';

const persistConfig = {
  key: 'invock',
  storage,
  blacklist
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ ...reducers, router: routerReducer })
);

export const history = createHistory();

const middlewares = [thunk, routerMiddleware(history)];

const buildStore = initialState => {
  return createStore(
    persistedReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
};

export const store = buildStore();
export const persistor = persistStore(store);
