import React, { Component } from 'react';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import { Switch, Route } from 'react-router';

import { Header } from '../containers';
import { FlexCenter } from '../components';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #838383;
`;

const ContentSection = FlexCenter.extend`
  width: auto;
  height: calc(100vh - 64px);
`;

const CompaniesList = Loadable({
  loader: () => import('./companies/CompaniesList'),
  loading() {
    return <div>Loading...</div>;
  }
});

const RegisterCompany = Loadable({
  loader: () => import('./companies/RegisterCompany'),
  loading() {
    return <div>Loading...</div>;
  }
});

const SimilarCompanies = Loadable({
  loader: () => import('./companies/SimilarCompanies'),
  loading() {
    return <div>Loading...</div>;
  }
});

const SelectedCompany = Loadable({
  loader: () => import('./companies/SelectedCompany'),
  loading() {
    return <div>Loading...</div>;
  }
});

const AdminAccess = Loadable({
  loader: () => import('./companies/AdminAccess'),
  loading() {
    return <div>Loading...</div>;
  }
});

class CompaniesDashboard extends Component {
  render() {
    const { match } = this.props;

    return (
      <Container>
        <Header />
        <ContentSection>
          <Switch>
            <Route path={`${match.url}/list`} component={CompaniesList} />
            <Route path={`${match.url}/add`} component={RegisterCompany} />
            <Route path={`${match.url}/similar-companies`} component={SimilarCompanies} />
            <Route path={`${match.url}/company`} component={SelectedCompany} />
            <Route path={`${match.url}/request-access`} component={AdminAccess} />
          </Switch>
        </ContentSection>
      </Container>
    );
  }
}

export default CompaniesDashboard;
