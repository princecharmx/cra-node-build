import cookie from 'react-cookies';
import { navigate } from './nav';
import * as authApi from '../api/auth';

import {
  OTP_REQUESTED,
  OTP_SUCCESS,
  OTP_FAILED,
  OTP_VERIFICATION_REQUESTED,
  OTP_VERIFICATION_SUCCESS,
  OTP_VERIFICATION_FAILED
} from './types';

const generateOtp = (payload, testing = false) => dispatch => {
  dispatch({ type: OTP_REQUESTED, payload: {} });

  authApi
    .generateOtp(payload, testing)
    .then(result => {
      dispatch({ type: OTP_SUCCESS, payload: result });
    })
    .catch(error => {
      dispatch({ type: OTP_FAILED, payload: error });
    });
};

const verifyOtp = (name, phone, otpToken) => dispatch => {
  dispatch({ type: OTP_VERIFICATION_REQUESTED, payload: {} });

  authApi
    .verifyOtp(name, phone, otpToken)
    .then(result => {
      // save cookies for backward compatibility
      cookie.save('userName', name, { path: '/' });
      cookie.save('userAccessToken', result.accessToken.id, { path: '/' });
      cookie.save('iUserId', result.accessToken.userId, { path: '/' });

      dispatch({ type: OTP_VERIFICATION_SUCCESS, payload: result });
      navigate(dispatch, `/companies/list`);
    })
    .catch(error => dispatch({ type: OTP_VERIFICATION_FAILED, payload: error }));
};

export { generateOtp, verifyOtp };
