import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import './assets/css/animate.min.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';
import './assets/sass/light-bootstrap-dashboard.css';
import orgs from './redux/reducers/orgs';
import events from './redux/reducers/events';
import indexRoutes from './routes';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import storage from 'redux-persist/lib/storage';
import {persistStore, persistReducer} from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
	key: 'root',
	storage,
};

const zingos = () => {
	const middleware = [thunk];
	//const usedStorage = sessionStorage
	if (process.env !== 'production') {
		middleware.push(createLogger());
	}
	let rootReducer = combineReducers({
		orgs,
		events,
	})
	const enhancer = composeWithDevTools({})(applyMiddleware(...middleware));
	const persistedReducer = persistReducer(persistConfig, rootReducer);
	let store = createStore(persistedReducer, {}, enhancer);
	let persistor = persistStore(store);
	return {store, persistor};
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
