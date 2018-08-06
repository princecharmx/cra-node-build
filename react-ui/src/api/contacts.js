import { companyAuthFetch, extractData } from './server';

export const fetchContacts = companyId =>
  companyAuthFetch.get(`/i-companies/${companyId}/businesses`).then(extractData);

export const fetchPartyStatement = (companyId, partyId, startDate, endDate) =>
  companyAuthFetch
    .get(
      `/i-companies/${companyId}/businesses/${partyId}/statement?startDate=${startDate}&endDate=${endDate}`
    )
    .then(extractData);

export const addContact = (companyId, payload) => {
  return companyAuthFetch.post(`/i-companies/${companyId}/business-profile`, payload);
};

export const updateContactName = (companyId, phoneId, name) => {
  return companyAuthFetch.put(`/i-companies/${companyId}/contacts/${phoneId}`, {
    name
  });
};

export const checkForName = (companyId, phone) => {
  return companyAuthFetch.get(`/i-companies/${companyId}/contacts/${phone}`);
};
