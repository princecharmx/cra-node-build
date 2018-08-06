import { userAuthFetch, companyAuthFetch, extractData, companyBranchFetch } from './server';

export const fetchCompanies = userId =>
  userAuthFetch.get(`i-users/${userId}/companies`).then(extractData);

export const companyLogin = (userId, companyId, password) =>
  userAuthFetch
    .post(`/i-users/${userId}/companies/${companyId}/login`, { password })
    .then(extractData);

export const fetchCompanyItems = companyId =>
  companyAuthFetch.get(`/i-companies/${companyId}/items/include-group`).then(extractData);

export const fetchCompanyBranch = companyId =>
  companyBranchFetch.get(`/i-companies/${companyId}/i-branches`).then(extractData);

export const fetchCompanyMembers = companyId =>
  companyAuthFetch.get(`/i-companies/${companyId}/team/names`).then(extractData);

export const addItem = (companyId, payload) =>
  companyAuthFetch.post(`/i-companies/${companyId}/items`, payload).then(extractData);

export const getGSTMaster = () =>
  userAuthFetch.get(`/configurations/gst-business-types`).then(extractData);

export const createCompany = (userId, payload) =>
  userAuthFetch.post(`/i-users/${userId}/companies/register`, payload).then(extractData);

export const requestCompanyAccess = (userId, companyId) =>
  userAuthFetch.post(`/i-users/${userId}/companies/${companyId}/join-request`).then(extractData);

export const createItemGroup = (companyId, payload) =>
  companyAuthFetch.post(`/i-companies/${companyId}/item-groups`, payload).then(extractData);

export const getItemGroup = iCompanyId =>
  companyAuthFetch.get(`/i-companies/${iCompanyId}/item-groups`).then(extractData);

export const createItem = (iCompanyId, payload) =>
  companyAuthFetch.post(`/i-companies/${iCompanyId}/items`, payload).then(extractData);
