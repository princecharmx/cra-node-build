import {
  MEMBERS_LIST,
  SIMILAR_COMPANIES_DATA,
  SIMILAR_COMPANIES_CHECK,
  REGISTER_COMPANY_PAYLOAD
} from '../constants';

import {
  COMPANIES_LIST_SUCCESS,
  CHANGE_COMPANY,
  COMPANY_AUTH_SUCCESS,
  COMPANY_BRANCH_SUCCESS
} from '../actions/types';

export const similarCompaniesData = (state = null, payload) => {
  if (payload.type === SIMILAR_COMPANIES_DATA) {
    return payload.payload;
  }
  return state;
};

export const similarCompanyCheck = (state = false, payload) => {
  if (payload.type === SIMILAR_COMPANIES_CHECK) {
    return payload.payload;
  }
  return state;
};

export const registerCompanyData = (state = null, payload) => {
  if (payload.type === REGISTER_COMPANY_PAYLOAD) {
    return payload.payload;
  }
  return state;
};

export const teamMembersData = (state = null, payload) => {
  if (payload.type === MEMBERS_LIST) {
    return payload.payload;
  }
  return state;
};

const initialState = [];

export const companies = (state = initialState, action) => {
  switch (action.type) {
    case COMPANIES_LIST_SUCCESS:
      return [...state, ...action.payload];
    case COMPANY_BRANCH_SUCCESS:
      return Object.assign({}, ...state, { branch: action.payload });
    default:
      return state;
  }
};

export const currentCompany = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_COMPANY:
      return action.payload;
    case COMPANY_AUTH_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken.id,
        ttl: action.payload.accessToken.ttl
      };
    default:
      return state;
  }
};

//selectors

// const filterName = ['name','id'];
export const getBranchNameId = state =>
  state.map(item => ({
    name: item.name,
    id: item.id
  }));
