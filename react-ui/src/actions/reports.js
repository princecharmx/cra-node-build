import * as api from '../api/reports';
import {
  FETCH_TRIAL_BALANCE_SUCCESS,
  FETCH_TRIAL_BALANCE_FAIL,
  SHOW_DETAIL_VIEW,
  SET_ROUTES_DETAILS,
  SET_ROUTING_STATUS,
  SET_GROUP_DETAILS,
  SHOW_LEDGER_VIEW,
  SET_LEDGER_DETAILS,
  RESET_TO_TRIAL_HOME,
  SHOW_YEARLY_VIEW,
  SHOW_MONTHLY_VIEW,
  SHOW_PERIOD_DIALOG,
  CHANGE_DATE_RANGE
} from './types';

export const getTrialBalance = () => (dispatch, getState) => {
  const { currentCompany: { id }, reports: { dateRange } } = getState();
  api
    .getTrialBalance(id, new Date(dateRange.startDate), new Date(dateRange.endDate))
    .then(response => {
      dispatch({ type: FETCH_TRIAL_BALANCE_SUCCESS, payload: response });
    })
    .catch(error => {
      dispatch({ type: FETCH_TRIAL_BALANCE_FAIL, payload: error });
      alert('fetch error');
    });
};

export const getLedgerWiseReport = () => (dispatch, getState) => {
  const { currentCompany: { id }, reports: { dateRange } } = getState();
  api
    .getLedgerWiseReport(id, dateRange.startDate, dateRange.endDate)
    .then(response => {
      // dispatch to groupDetails
      dispatch({
        type: SET_LEDGER_DETAILS,
        payload: response
      });
    })
    .catch(error => {
      dispatch({ type: SET_GROUP_DETAILS, payload: error });
      alert('fetch error');
    });
};

export const getAccountByPath = account => (dispatch, getState) => {
  const {
    currentCompany: { id },
    reports: { dateRange, headerProperties: { path, groupName } }
  } = getState();
  let accountPath, accountGrpName;
  if (account) {
    accountPath = account.path;
    accountGrpName = account.accountGroup;
  } else {
    accountPath = path;
    accountGrpName = groupName;
  }
  api
    .getAccountByPath(id, accountPath, dateRange.startDate, dateRange.endDate)
    .then(response => {
      // dispatch to groupDetails
      dispatch({
        type: SET_GROUP_DETAILS,
        payload: {
          response: response,
          // isAccount: account.isAccount,
          groupName: accountGrpName,
          path: accountPath
        }
      });
    })
    .catch(error => {
      dispatch({ type: SET_GROUP_DETAILS, payload: error });
      alert('fetch error');
    });
};

export const showYearlyViewAction = account => (dispatch, getState) => {
  const {
    currentCompany: { id },
    reports: { dateRange, headerProperties: { accountId, groupName } }
  } = getState();
  let accountIdToPass, accountNameToPass;
  if (account) {
    accountIdToPass = account.id ? account.id : account.accountId;
    accountNameToPass = account.name;
  } else {
    accountIdToPass = accountId;
    accountNameToPass = groupName;
  }
  api
    .getYearlyWiseReport(id, accountIdToPass, dateRange.startDate, dateRange.endDate)
    .then(response => {
      dispatch({
        type: SHOW_YEARLY_VIEW,
        payload: {
          response: response,
          accountName: accountNameToPass,
          accountId: accountIdToPass
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const showMonthlyViewAction = item => (dispatch, getState) => {
  const { currentCompany: { id }, reports: { headerProperties: { accountId } } } = getState();
  api
    .getMonthlyWiseReport(id, accountId, new Date(item.month.start), new Date(item.month.end))
    .then(response => {
      dispatch({
        type: SHOW_MONTHLY_VIEW,
        payload: {
          response: response
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//this actions get fired form here to render details view
// with the obj of  which details view has been ckicked
export const showDetailView = (key, obj) => dispatch => {
  dispatch({
    type: SHOW_DETAIL_VIEW
  });
  key && obj && dispatch(setActiveAccountGroup(key, obj));
};

export const setActiveAccountGroup = (key, obj) => ({
  type: SET_ROUTES_DETAILS,
  routes: {
    [key]: obj
  }
});

export const showLedgerView = () => {
  return {
    type: SHOW_LEDGER_VIEW
  };
};

export const setRoutingStatus = (isAccount, groupName) => {
  return {
    type: SET_ROUTING_STATUS,
    status: {
      isAccount: isAccount,
      groupName: groupName
    }
  };
};

export const resetToTrialHome = () => {
  return {
    type: RESET_TO_TRIAL_HOME
  };
};

export const showPeriodDialogAction = () => {
  return {
    type: SHOW_PERIOD_DIALOG
  };
};

export const changeDateRange = dateRange => (dispatch, getState) => {
  dispatch({
    type: CHANGE_DATE_RANGE,
    range: dateRange
  });
  let { reports: { headerProperties } } = getState();
  dispatch(getTrialBalance());
  dispatch(getLedgerWiseReport());
  if (headerProperties.showYearlyView) {
    dispatch(showYearlyViewAction());
  } else if (headerProperties.showMonthlyView) {
    dispatch(showMonthlyViewAction());
  } else if (headerProperties.takeGroupDetails) {
    dispatch(getAccountByPath());
  }
  // return {
  //   type: CHANGE_DATE_RANGE,
  //   range: dateRange
  // };
};
