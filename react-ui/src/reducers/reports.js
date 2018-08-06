import {
  FETCH_TRIAL_BALANCE_SUCCESS,
  SHOW_DETAIL_VIEW,
  SET_ROUTING_STATUS,
  SET_GROUP_DETAILS,
  SHOW_LEDGER_VIEW,
  SET_LEDGER_DETAILS,
  RESET_TO_TRIAL_HOME,
  SET_ROUTES_DETAILS,
  SHOW_YEARLY_VIEW,
  SHOW_MONTHLY_VIEW,
  SHOW_PERIOD_DIALOG,
  CHANGE_DATE_RANGE
} from '../actions/types';
import { getStartOfFinancialYear, getEndOfFinancialYear } from '../utils';

const initialState = {
  trialBalanceData: [],
  groupDetails: [],
  yearlyDetails: {},
  monthlyDetails: {},
  ledgerWiseDetails: [],
  headerProperties: {
    showDetailView: true,
    showDetailsCondencedBtn: true,
    showLedgerGroupBtn: true,
    showLedgerView: true,
    renderSubGrp: true,
    isAccount: false,
    groupName: 'Particulars',
    accountId: '',
    path: '',
    tableView: 'groupView',
    showYearlyView: false,
    showMonthlyView: false,
    takeGroupDetails: false,
    showPeriodButton: true,
    showPeriodDialog: false
  },
  dateRange: {
    startDate: getStartOfFinancialYear(new Date()),
    endDate: getEndOfFinancialYear(new Date())
  }
};

export const reports = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRIAL_BALANCE_SUCCESS:
      return {
        ...state,
        trialBalanceData: action.payload
      };
    case SHOW_DETAIL_VIEW:
      return {
        ...state,
        headerProperties: {
          ...state.headerProperties,
          showDetailView: !state.headerProperties.showDetailView
        }
      };
    case SET_ROUTES_DETAILS:
      return {
        ...state,
        routes: action.routes
      };
    case SET_ROUTING_STATUS:
      return {
        ...state,
        onClickStatus: {
          ...state.onClickStatus,
          isAccount: action.status.isAccount,
          groupName: action.status.groupName
        }
      };
    case SET_GROUP_DETAILS:
      return {
        ...state,
        groupDetails: action.payload.response,
        headerProperties: {
          ...state.headerProperties,
          showDetailView: true,
          showDetailsCondencedBtn: false,
          showLedgerGroupBtn: false,
          showLedgerView: false,
          renderSubGrp: false,
          isAccount: action.payload.isAccount,
          groupName: action.payload.groupName,
          path: action.payload.path,
          takeGroupDetails: true
        }
      };
    case SHOW_LEDGER_VIEW:
      return {
        ...state,
        headerProperties: {
          ...state.headerProperties,
          showLedgerView: !state.headerProperties.showLedgerView,
          showDetailsCondencedBtn: !state.headerProperties.showDetailsCondencedBtn
        }
      };
    case SET_LEDGER_DETAILS:
      return {
        ...state,
        ledgerWiseDetails: action.payload
      };
    case RESET_TO_TRIAL_HOME:
      return {
        ...initialState,
        trialBalanceData: state.trialBalanceData,
        ledgerWiseDetails: state.ledgerWiseDetails
      };
    case SHOW_YEARLY_VIEW:
      return {
        ...state,
        yearlyDetails: action.payload.response,
        headerProperties: {
          ...state.headerProperties,
          showDetailView: true,
          showDetailsCondencedBtn: false,
          showLedgerGroupBtn: false,
          showLedgerView: true,
          renderSubGrp: false,
          // isAccount: action.payload.isAccount,
          groupName: action.payload.accountName,
          accountId: action.payload.accountId,
          showYearlyView: true,
          takeGroupDetails: false
        }
      };
    case SHOW_MONTHLY_VIEW:
      return {
        ...state,
        monthlyDetails: action.payload.response,
        headerProperties: {
          ...state.headerProperties,
          showDetailView: true,
          showDetailsCondencedBtn: false,
          showLedgerGroupBtn: false,
          showLedgerView: true,
          renderSubGrp: false,
          showYearlyView: false,
          showMonthlyView: true
        }
      };
    case SHOW_PERIOD_DIALOG:
      return {
        ...state,
        headerProperties: {
          ...state.headerProperties,
          showPeriodDialog: !state.headerProperties.showPeriodDialog
        }
      };
    case CHANGE_DATE_RANGE:
      return {
        ...state,
        dateRange: {
          startDate: action.range.startDate,
          endDate: action.range.endDate
        },
        headerProperties: {
          ...state.headerProperties,
          showPeriodDialog: false
        }
      };
    default:
      return state;
  }
};

export const getDetailButtonStatus = ({ reports: { headerProperties: { showDetailView } } }) =>
  showDetailView;

export const fetchTrailBalanceData = ({ reports: { trialBalanceData } }) => trialBalanceData;
export const getHeaderProperties = ({ reports: { headerProperties } }) => headerProperties;
export const getGroupDetails = ({ reports: { groupDetails } }) => groupDetails;
export const getLedgerButtonStatus = ({ reports: { headerProperties: { showLedgerView } } }) =>
  showLedgerView;
export const getDateRange = ({ reports: { dateRange } }) => dateRange;
export const getCompanyName = ({ currentCompany: { name } }) => name;
export const getLedgerWiseDetails = ({ reports: { ledgerWiseDetails } }) => ledgerWiseDetails;
export const getYearlyWiseDetails = ({ reports: { yearlyDetails } }) => yearlyDetails;
export const getMonthlyWiseDetails = ({ reports: { monthlyDetails } }) => monthlyDetails;
