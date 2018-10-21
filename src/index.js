/* eslint-disable react/jsx-filename-extension,no-undef */
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import './assets/css/animate.min.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';
import './assets/sass/light-bootstrap-dashboard.css';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import indexRoutes from './routes';
import events from './redux/reducers/events';
import orgs from './redux/reducers/orgs';
import users from './redux/reducers/users';
import login from "./redux/reducers/login";

const persistConfig = {
  key: 'root',
  storage,
};

const zingos = () => {
  const middleware = [thunk];
  // const usedStorage = sessionStorage
  if (process.env !== 'production') {
    middleware.push(createLogger());
  }
  const rootReducer = combineReducers({
    orgs,
    events,
    users,
    login,
  });
  const enhancer = composeWithDevTools({})(applyMiddleware(...middleware));
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, {}, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
};

ReactDOM.render(
  <Provider store={zingos().store}>
    <PersistGate loading={null} persistor={zingos().persistor}>
      <HashRouter>
        <Switch>
          {indexRoutes.map(
          	(prop, key) => <Route to={prop.path} component={prop.component} key={key} />,
          )}
        </Switch>
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
