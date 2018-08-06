import { OTP_REQUESTED, OTP_SUCCESS, OTP_VERIFICATION_SUCCESS } from '../actions/types';

const initialState = {
  loadingGenerateOtp: false,
  signIn: false
};

// const registerCookies = ()

export const user = (state = initialState, action) => {
  switch (action.type) {
    case OTP_REQUESTED:
      return {
        ...state,
        ...action.payload,
        loadingGenerateOtp: true
      };

    case OTP_SUCCESS:
      return {
        ...state,
        ...action.payload.iUser,
        signIn: true,
        loadingGenerateOtp: initialState.loadingGenerateOtp
      };
    case OTP_VERIFICATION_SUCCESS:
      return {
        ...state,
        ...action.payload.iUser,
        accessToken: action.payload.accessToken.id
      };
    default:
      return state;
  }
};

// const getTempItemData = (state = null, payload) => {
//   if (payload.type === VERIFY_OTP) {
//     return payload.payload;
//   }
//   return state;
// };
