export const setUsers = users => (dispatch, getState) => {
  dispatch({ type: 'SET_USERS', data: users });
};
