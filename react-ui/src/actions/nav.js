import { push } from 'react-router-redux';

// TODO: Give some time to redux data store to sync.
export const navigate = (dispatch, to) => {
  setTimeout(() => {
    dispatch(push(to));
  }, 200);
};
