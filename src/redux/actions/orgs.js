export const setOrgs = (orgs) => (dispatch, getState) => {
	dispatch({type: 'SET_ORGS', data: orgs});
};