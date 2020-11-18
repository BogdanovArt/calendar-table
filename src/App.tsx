import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home, TimeReport, WorkLoad, routes } from './routes';
import { Provider } from 'react-redux';
import { store } from './store';

import 'assets/styles/variables.scss';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route exact={true} path={routes.deal} component={Home}/>
              <Route exact={true} path={routes.time} component={TimeReport}/>
              <Route exact={true} path={routes.workload} component={WorkLoad}/>
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
