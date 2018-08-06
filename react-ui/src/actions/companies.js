import cookie from 'react-cookies';
import { navigate } from './nav';

import {
  MEMBERS_LIST,
  SIMILAR_COMPANIES_DATA,
  SIMILAR_COMPANIES_CHECK,
  REGISTER_COMPANY_PAYLOAD,
  VOUCHER_TYPE_PURCHASE
} from '../constants';

import {
  CHANGE_COMPANY,
  COMPANY_AUTH_FAILED,
  COMPANY_AUTH_SUCCESS,
  COMPANIES_LIST_FAILED,
  COMPANIES_LIST_SUCCESS,
  COMPANY_BRANCH_FAILURE,
  COMPANY_BRANCH_SUCCESS,
  COMPANY_AUTH_REQUESTED,
  COMPANY_MEMBERS_FAILED,
  COMPANY_MEMBERS_SUCCESS,
  COMPANIES_LIST_REQUESTED,
  COMPANY_BRANCH_REQUESTED,
  COMPANY_MEMBERS_REQUESTED
} from './types';

import * as api from '../api/companies';

export const similarCompanies = payload => {
  return {
    type: SIMILAR_COMPANIES_DATA,
    payload: payload
  };
};

export const toggleSimilarCompanyCheck = toggleState => {
  return {
    type: SIMILAR_COMPANIES_CHECK,
    payload: toggleState
  };
};

export const registerCompanyPayload = payload => {
  return {
    type: REGISTER_COMPANY_PAYLOAD,
    payload: payload
  };
};

export const storeTeamMembers = payload => {
  return {
    type: MEMBERS_LIST,
    payload: payload
  };
};

export const fetchCompanies = () => (dispatch, getState) => {
  dispatch({ type: COMPANIES_LIST_REQUESTED, payload: {} });

  const { user } = getState();

  api
    .fetchCompanies(user.id)
    .then(response => {
      dispatch({ type: COMPANIES_LIST_SUCCESS, payload: response });
    })
    .catch(error => dispatch({ type: COMPANIES_LIST_FAILED, payload: error }));
};

export const selectCompany = companyId => (dispatch, getState) => {
  const { companies } = getState();

  const currentCompany = companies.find(company => company.id === companyId);

  cookie.save('tempCompanyId', currentCompany.id, { path: '/' });
  cookie.save('tempCompanyName', currentCompany.name, { path: '/' });

  dispatch({ type: CHANGE_COMPANY, payload: currentCompany });
  // ALways navigate inside company and if authorization fail
  // then route to company login screen
  const page = 'vouchers';
  const type = VOUCHER_TYPE_PURCHASE;
  navigate(dispatch, `/${currentCompany.id}/home/${page}/${type}/list`);
  // navigate(dispatch, `/companies/company/${companyId}`);
};

export const fetchCompanyBranch = () => (dispatch, getState) => {
  const { currentCompany } = getState();
  dispatch({ type: COMPANY_BRANCH_REQUESTED });
  api
    .fetchCompanyBranch(currentCompany.id)
    .then(response => {
      let filteredCompay = response.filter(data => data.iCompanyId === currentCompany.id);
      dispatch({ type: COMPANY_BRANCH_SUCCESS, payload: filteredCompay });
    })
    .catch(error => dispatch({ type: COMPANY_BRANCH_FAILURE, payload: error }));
};

export const authCompany = password => (dispatch, getState) => {
  dispatch({ type: COMPANY_AUTH_REQUESTED, payload: {} });

  const { currentCompany, user } = getState();

  api
    .companyLogin(user.id, currentCompany.id, password)
    .then(data => {
      cookie.save(currentCompany.id, data.accessToken.iCompanyId, { path: '/' });
      cookie.save(`${user.id}@${data.accessToken.iCompanyId}`, data.accessToken.id, {
        path: '/'
      });
      dispatch({ type: COMPANY_AUTH_SUCCESS, payload: data });
      navigate(dispatch, `/${data.accessToken.iCompanyId}/home/vouchers/purchase/list`);
    })
    .catch(error => dispatch({ type: COMPANY_AUTH_FAILED, payload: error }));
};

export const fetchCompanyMembers = companyId => dispatch => {
  dispatch({ type: COMPANY_MEMBERS_REQUESTED, payload: {} });

  api
    .fetchCompanyMembers(companyId)
    .then(response => {
      dispatch({ type: COMPANY_MEMBERS_SUCCESS, payload: response });
      dispatch({ type: MEMBERS_LIST, payload: response });
    })
    .catch(error => dispatch({ type: COMPANY_MEMBERS_FAILED, payload: error }));
};
