export const setUserInfo = info => (dispatch, getState) => {
  dispatch({ type: 'SET_USER_INFO', data: info });
};

export const authUser = () => (dispatch, getState) => {
  dispatch({ type: 'AUTH_USER' });
};

export const logOut = () => (dispatch, getState) => {
  dispatch({ type: 'LOG_OUT' });
};
