import { BUSINESS_ACCOUNTS } from '../constants';
import { fetchCurrentBalance } from './vouchers';
import {
  CONTACT_LIST_FAILED,
  CONTACT_LIST_SUCCESS,
  CHECK_FOR_NAME_FAILED,
  CHECK_FOR_NAME_SUCCESS,
  CONTACT_LIST_REQUESTED,
  TOGGLE_OPEN_ADD_CONTACT,
  ADD_CONTACT_DATA_FAILED,
  ADD_CONTACT_DATA_REQUEST,
  ADD_CONTACT_DATA_SUCCESSS,
  UPDATE_CONTACT_NAME_FAILED,
  UPDATE_CONTACT_NAME_SUCCESS,
  PARTY_STATEMENT_SUCCESS,
  PARTY_STATEMENT_FAILED
} from './types';

import * as api from '../api/contacts';

export const storeBusinessAccounts = payload => {
  return {
    type: BUSINESS_ACCOUNTS,
    payload: payload
  };
};

export const drawerOpenAddContact = () => ({
  type: TOGGLE_OPEN_ADD_CONTACT
});

export const fetchContacts = companyId => dispatch => {
  dispatch({ type: CONTACT_LIST_REQUESTED, payload: {} });

  api
    .fetchContacts(companyId)
    .then(response => {
      dispatch({ type: CONTACT_LIST_SUCCESS, payload: response });
      dispatch({ type: BUSINESS_ACCOUNTS, payload: response });
    })
    .catch(error => dispatch({ type: CONTACT_LIST_FAILED, payload: error }));
};

export const fetchPartyStatement = (
  companyId,
  partyId,
  startDate,
  endDate,
  storeKey
) => dispatch => {
  api
    .fetchPartyStatement(companyId, partyId, startDate, endDate)
    .then(response => {
      response.startDate = startDate;
      response.endDate = endDate;
      dispatch({ type: PARTY_STATEMENT_SUCCESS, key: storeKey, payload: response });
    })
    .catch(error => dispatch({ type: PARTY_STATEMENT_FAILED, key: storeKey, payload: error }));
};

export const nameCheckformPhone = phone => (dispatch, getState) => {
  const { currentCompany } = getState();
  api
    .checkForName(currentCompany.id, phone)
    .then(response => dispatch({ type: CHECK_FOR_NAME_SUCCESS, payload: response.data }))
    .catch(error => dispatch({ type: CHECK_FOR_NAME_FAILED }));
};

export const updateContactName = (id, name) => (dispatch, getState) => {
  const { currentCompany } = getState();
  api
    .updateContactName(currentCompany.id, id, name)
    .then(
      response =>
        response.status === 200 &&
        response.statusText === 'OK' &&
        dispatch({ type: UPDATE_CONTACT_NAME_SUCCESS, status: 'success' })
    )
    .catch(error => dispatch({ type: UPDATE_CONTACT_NAME_FAILED, status: 'failure' }));
};

export const addContactSave = payload => (dispatch, getState) => {
  const { currentCompany, router } = getState();
  dispatch({ type: ADD_CONTACT_DATA_REQUEST });
  api
    .addContact(currentCompany.id, payload)
    .then(response => response.data)
    .then(response => {
      dispatch(fetchCurrentBalance(response.id));
      if (router.pathname !== `/${currentCompany.id}/home/parties`) {
        dispatch({ type: ADD_CONTACT_DATA_SUCCESSS, response });
      }
      dispatch(fetchContacts(currentCompany.id));
      dispatch(drawerOpenAddContact());
    })
    .catch(error => dispatch({ type: ADD_CONTACT_DATA_FAILED }));
};
