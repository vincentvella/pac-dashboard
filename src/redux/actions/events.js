export const setPendingEvents = (events) => (dispatch, getState) => {
	dispatch({type: 'SET_PENDING_EVENTS', data: events});
};