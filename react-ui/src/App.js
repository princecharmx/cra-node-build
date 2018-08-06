import mixpanel from 'mixpanel-browser';
import React, { Component } from 'react';
import ClevertapReact from 'clevertap-react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import { appInit } from './actions';

import { asyncComponent } from './components';
import { CLEVERTAP_ID, MIXPANEL_ID } from './constants';
import { history } from './store';

const AsyncLogin = asyncComponent(() => import('./pages/Login'));
const AsyncHomePage = asyncComponent(() => import('./pages/Dashboard'));
const AsyncViewVoucher = asyncComponent(() => import('./pages/ViewVoucher'));
const AsyncCompaniesPage = asyncComponent(() => import('./pages/CompaniesDashboard'));

class App extends Component {
  constructor() {
    super();
    mixpanel.init(MIXPANEL_ID);
    ClevertapReact.initialize(CLEVERTAP_ID);
  }

  componentDidMount() {
    this.props.appInit();
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={AsyncLogin} />
          <Route exact path="/login" component={AsyncLogin} />
          <Route exact path="/view/shared-voucher/:shareId" component={AsyncViewVoucher} />

          <Route path="/companies" component={AsyncCompaniesPage} />

          <Route exact path="/:id/home/:page" component={AsyncHomePage} />
          {/* different routes for reports */}

          {/* different routes for vouchers */}
          <Route exact path="/:id/home/:page/:type" component={AsyncHomePage} />
          <Route exact path="/:id/home/:page/:voucher/:type" component={AsyncHomePage} />
          <Route exact path="/:id/home/:page/:voucher/:type/:voucherID" component={AsyncHomePage} />
        </Switch>
      </ConnectedRouter>
    );
  }
}

export default connect(() => ({}), { appInit })(App);
