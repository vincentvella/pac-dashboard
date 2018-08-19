import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import './assets/css/animate.min.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';
import './assets/sass/light-bootstrap-dashboard.css';
import orgs from './redux/orgs';
import indexRoutes from './routes';

const store = createStore(
  combineReducers([orgs]),
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        {indexRoutes.map(
          (prop, key) => <Route to={prop.path} component={prop.component} key={key} />,
        )}
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);
