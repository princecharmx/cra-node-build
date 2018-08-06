import axios from 'axios';
import cookie from 'react-cookies';
import merge from 'lodash/merge';

const STAG_URL = 'https://invock-backend-staging.herokuapp.com/api';
const PROD_URL = 'https://invock-backend-prod.herokuapp.com/api';

const defaultAxiosOptions = {
  baseURL: STAG_URL
};

// const prodAxiosOptions = {
//   baseURL: PROD_URL
// };

// Server request without authentication
export const fetch = axios.create(defaultAxiosOptions);

// Request to server with authorized header

export const userAuthFetch = axios.create(defaultAxiosOptions);

export const companyAuthFetch = axios.create(defaultAxiosOptions);

export const companyBranchFetch = axios.create(defaultAxiosOptions);

export const mergeParams = (params = {}, testing) => merge(params, { testing: testing });

userAuthFetch.interceptors.request.use(config => {
  config.headers['authorization'] = cookie.load('userAccessToken');

  return config;
});

companyAuthFetch.interceptors.request.use(config => {
  config.headers['authorization'] = cookie.load(
    `${cookie.load('iUserId')}@${cookie.load('tempCompanyId')}`
  );
  return config;
});

companyBranchFetch.interceptors.request.use(config => {
  config.headers['authorization'] = cookie.load(
    `${cookie.load('iUserId')}@${cookie.load('tempCompanyId')}`
  );
  return config;
});

export const extractData = r => r.data;
export const serverError = error =>
  alert(
    error.response && error.response.data && error.response.data !== null
      ? error.response.data.message
      : 'something went wrong pls try again'
  );
