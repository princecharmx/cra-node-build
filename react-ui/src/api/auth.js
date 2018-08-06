import { fetch, mergeParams, extractData } from './server';

const OTP_URL = `/i-users/sign-in-user-mobile`;
const VERIFY_OTP_URL = `/i-users/sign-in-user-mobile-verification`;

export const generateOtp = (phone, testing) => {
  return fetch
    .post(
      OTP_URL,
      mergeParams(
        {
          phone
        },
        testing
      )
    )
    .then(extractData)
    .then(data => {
      if (testing) {
        alert(`test otp is: ${data.smsId.otp}`);
      }
      return data;
    });
};

export const verifyOtp = (name, phone, otpToken) => {
  return fetch.post(VERIFY_OTP_URL, { name, otpToken, phone }).then(extractData);
};
