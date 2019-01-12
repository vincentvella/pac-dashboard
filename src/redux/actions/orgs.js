export const setOrgs = orgs => (dispatch) => {
  dispatch({
    type: 'SET_ORGS',
    data: orgs,
  });
};
