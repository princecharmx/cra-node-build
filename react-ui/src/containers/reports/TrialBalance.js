import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getTrialBalance,
  showDetailView,
  setRoutingStatus,
  getAccountByPath,
  showLedgerView,
  getLedgerWiseReport,
  resetToTrialHome,
  setActiveAccountGroup,
  showYearlyViewAction,
  showMonthlyViewAction,
  showPeriodDialogAction,
  changeDateRange
} from '../../actions';
import {
  getDetailButtonStatus,
  getLedgerButtonStatus,
  fetchTrailBalanceData,
  getHeaderProperties,
  getGroupDetails,
  getDateRange,
  getCompanyName,
  getLedgerWiseDetails,
  getYearlyWiseDetails,
  getMonthlyWiseDetails
} from '../../reducers';
import { Card, CardTitle, CardText, TableFooter } from 'material-ui';

import { getStartOfFinancialYear, getEndOfFinancialYear } from '../../utils';

import { HeaderComponent } from '../../components/reports/cardHeader';
import { TableHeaderComponent } from '../../components/reports/tableHeaderComponent';
import { TableBodyComponent } from '../../components/reports/tableBodyComponent';
import { TableFooterComponent } from '../../components/reports/tableFooterComponent';
import { YearlyBreakupComponent } from '../../components/reports/yearWiseBreakup';
import { MonthlyBreakupComponent } from '../../components/reports/monthlyBreakup';
import { MonthlyTableHeaderComponent } from '../../components/reports/monthlyTableHeader';
import { MonthlyTableFooterComponent } from '../../components/reports/monthlyTableFooter';
import DateRangeDialog from '../../components/reports/dateRangeDialog';
import { AddDetailsLink } from '../../components/reports/linkButtons';
import { TrialBalanceTableComponent } from '../../components/reports/trialBalanceTableComponent';
import { Table, TableHeader, TableBody } from 'material-ui/Table';

class TrialBalance extends Component {
  state = {
    loading: false,
    resetToDefaultState: false,
    _trialBalanceData: [],
    detailedView: false
  };
  componentDidMount() {
    this.props.getTrialBalance();
    this.props.getLedgerWiseReport();
  }
  handleChange = event => {
    this.setState({ height: event.target.value });
  };
  OnclikCondencedView = () => {
    this.setState({ detailedView: false });
  };
  OnclikDetailedView = () => {
    this.setState({ detailedView: true });
  };

  render() {
    // const showLedgerView = this.props.headerProperties.showLedgerView;
    // const showYearlyView = this.props.headerProperties.showYearlyView;
    // const showMonthlyView = this.props.headerProperties.showMonthlyView;
    const { headerProperties: { showLedgerView, showYearlyView, showMonthlyView } } = this.props;
    return (
      <div>
        {/* dynamic routes are going to happen from here based on dynamic routes */}

        <AddDetailsLink
          addDetailsFieds={'Reports > Trial Balance'}
          onClick={this.props.resetToTrialHome}
        />
        <DateRangeDialog
          showPeriodDialog={this.props.headerProperties.showPeriodDialog}
          showPeriodDialogAction={this.props.showPeriodDialogAction}
          dateRange={this.props.dateRange}
          changeDateRange={this.props.changeDateRange}
        />
        <Card style={{ width: '100%' }}>
          <CardTitle
            titleStyle={{ width: '100%' }}
            children={
              <HeaderComponent
                companyName={this.props.companyName}
                dateRange={this.props.dateRange}
                showLedgerButton={this.props.showLedgerButton}
                showPeriodButton={this.props.headerProperties.showPeriodButton}
                showDetailButton={this.props.showDetailButton}
                showDetailView={this.props.showDetailView}
                headerProperties={this.props.headerProperties}
                showLedgerView={this.props.showLedgerView}
                showMonthlyView={this.props.headerProperties.showMonthlyView}
                showPeriodDialogAction={this.props.showPeriodDialogAction}
              />
            }
          />
          <CardText>
            <Table selectable={true} fixedHeader={true} fixedFooter={true} height="260px">
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                children={
                  showMonthlyView ? (
                    <MonthlyTableHeaderComponent />
                  ) : (
                    <TableHeaderComponent
                      title={this.props.headerProperties.groupName}
                      showYearlyView={this.props.headerProperties.showYearlyView}
                    />
                  )
                }
              />
              <TableBody
                displayRowCheckbox={false}
                deselectOnClickaway={true}
                showRowHover={true}
                stripedRows={true}
                children={
                  !showLedgerView ? (
                    <TableBodyComponent
                      accountList={
                        this.props.headerProperties.takeGroupDetails
                          ? this.props.groupDetails
                          : this.props.ledgerWiseDetails
                      }
                      headerProperties={this.props.headerProperties}
                      setActiveAccountGroup={this.props.setActiveAccountGroup}
                      getAccountByPath={this.props.getAccountByPath}
                      showYearlyViewAction={this.props.showYearlyViewAction}
                    />
                  ) : showYearlyView ? (
                    <YearlyBreakupComponent
                      accountList={this.props.yearlyDetails}
                      showMonthlyViewAction={this.props.showMonthlyViewAction}
                    />
                  ) : showMonthlyView ? (
                    <MonthlyBreakupComponent accountList={this.props.monthlyDetails} />
                  ) : (
                    <TrialBalanceTableComponent
                      accountList={this.props.accounts}
                      showDetailButton={this.props.showDetailButton}
                      showDetailView={this.props.showDetailView}
                      setActiveAccountGroup={this.props.setActiveAccountGroup}
                      setRoutingStatus={this.props.setRoutingStatus}
                      getAccountByPath={this.props.getAccountByPath}
                      headerProperties={this.props.headerProperties}
                      groupDetails={this.props.groupDetails}
                      showYearlyViewAction={this.props.showYearlyViewAction}
                    />
                  )
                }
              />
              <TableFooter
                adjustForCheckbox={false}
                children={
                  showMonthlyView ? (
                    <MonthlyTableFooterComponent accountList={this.props.monthlyDetails} />
                  ) : (
                    <TableFooterComponent
                      accountList={
                        this.props.headerProperties.takeGroupDetails
                          ? this.props.groupDetails
                          : this.props.headerProperties.showYearlyView
                            ? this.props.yearlyDetails
                            : this.props.ledgerWiseDetails
                      }
                      showYearlyView={this.props.headerProperties.showYearlyView}
                    />
                  )
                }
              />
            </Table>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showDetailButton: getDetailButtonStatus(state),
    showLedgerButton: getLedgerButtonStatus(state),
    accounts: fetchTrailBalanceData(state),
    headerProperties: getHeaderProperties(state),
    groupDetails: getGroupDetails(state),
    dateRange: getDateRange(state),
    companyName: getCompanyName(state),
    ledgerWiseDetails: getLedgerWiseDetails(state),
    yearlyDetails: getYearlyWiseDetails(state),
    monthlyDetails: getMonthlyWiseDetails(state)
  };
};

export default connect(mapStateToProps, {
  getTrialBalance,
  showDetailView,
  showLedgerView,
  getStartOfFinancialYear,
  getEndOfFinancialYear,
  setRoutingStatus,
  getAccountByPath,
  getLedgerWiseReport,
  resetToTrialHome,
  setActiveAccountGroup,
  showYearlyViewAction,
  showMonthlyViewAction,
  showPeriodDialogAction,
  changeDateRange
})(TrialBalance);
