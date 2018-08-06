import { BUSINESS_ACCOUNTS } from '../constants';

import {
  UPDATE_CONTACT_NAME_SUCCESS,
  UPDATE_CONTACT_NAME_FAILED,
  ADD_CONTACT_NAME_FAILED,
  ADD_CONTACT_NAME_REQUEST,
  ADD_CONTACT_NAME_SUCCESS,
  ADD_CONTACT_DATA_SUCCESSS,
  CHECK_FOR_NAME_SUCCESS,
  CONTACT_LIST_SUCCESS,
  CONTACT_LIST_FAILED,
  TOGGLE_OPEN_ADD_CONTACT,
  CONTACT_LIST_REQUESTED,
  PARTY_STATEMENT_SUCCESS,
  CLOSE_BUSINESS_CARD
} from '../actions/types';

const businessAccountsData = (state = null, payload) => {
  if (payload.type === BUSINESS_ACCOUNTS) {
    return payload.payload;
  }
  return state;
};

const initialState = {
  loadingContactList: false,
  contactList: null,
  fetchStatus: null,
  createStatus: null,
  addContactResponse: {},
  partyStatement: {
    openingBalance: 0,
    closingBalance: 0,
    statement: [
      {
        _id: '',
        type: '',
        voucherNo: '',
        billFinalAmount: 0,
        createdAt: '2018-07-09',
        debit: 0,
        credit: 0,
        balance: 0
      }
    ]
  },
  app: {
    onHideAddContact: false
  },
  error: ''
};

const contacts = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTACT_DATA_SUCCESSS:
      return {
        ...state,
        addContactResponse: action.response
      };
    case CLOSE_BUSINESS_CARD:
      return {
        ...state,
        addContactResponse: {}
      };
    case CONTACT_LIST_REQUESTED:
      return {
        ...state,
        loadingContactList: true
      };
    case TOGGLE_OPEN_ADD_CONTACT:
      return {
        ...state,
        app: {
          ...state.app,
          onHideAddContact: !state.app.onHideAddContact
        }
      };
    case CONTACT_LIST_SUCCESS:
      return {
        ...state,
        fetchStatus: 'success',
        contactList: action.payload,
        loadingContactList: false
      };

    case CONTACT_LIST_FAILED:
      return {
        ...state,
        error: action.payload,
        fetchStatus: 'failure',
        loadingContactList: false
      };
    case ADD_CONTACT_NAME_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ADD_CONTACT_NAME_SUCCESS:
      return Object.assign({}, ...state, {
        error: '',
        loading: false,
        createStatus: 'success',
        payload: action.payload
      });
    case ADD_CONTACT_NAME_FAILED:
      return Object.assign({}, ...state, {
        payload: {},
        loading: false,
        createStatus: 'failure',
        error: action.error
      });
    case PARTY_STATEMENT_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          [action.key]: action.payload
        }
      );
    default:
      return state;
  }
};

const checkForName = (state = {}, action) => {
  switch (action.type) {
    case CHECK_FOR_NAME_SUCCESS:
      return Object.assign({}, ...state, action.payload);
    default:
      return state;
  }
};

const updateContactName = (state = null, action) => {
  switch (action.type) {
    case UPDATE_CONTACT_NAME_SUCCESS:
      return action.status;
    case UPDATE_CONTACT_NAME_FAILED:
      return action.status;
    default:
      return state;
  }
};

//selectors
const getAddContactToggleState = ({ contacts: { app: { onHideAddContact } } }) => onHideAddContact;
const getNewContactAdded = ({ contacts: { addContactResponse } }) => addContactResponse;

export {
  businessAccountsData,
  getNewContactAdded,
  getAddContactToggleState,
  contacts,
  checkForName,
  updateContactName
};
