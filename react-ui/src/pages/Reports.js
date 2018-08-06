import React, { Component } from 'react';
import LazyImport from '../utils/lazyImport';
import { Container } from '../components/Common';

const TrialBalance = LazyImport(() => import('../containers/reports/TrialBalance'));

class Reports extends Component {
  state = {
    loading: false,
    resetToDefaultState: false
  };

  handleReportsDynamicRoutes = id => {
    console.log(id);
  };
  render() {
    return (
      <Container>
        <TrialBalance {...this.props.company} breadCrumbItem={this.handleReportsDynamicRoutes} />
      </Container>
    );
  }
}

export default Reports;
