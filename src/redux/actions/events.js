export const setPendingEvents = (events) => (dispatch, getState) => {
	dispatch({type: 'SET_PENDING_EVENTS', data: events});
};

export const setLegacyEvents = (events) => (dispatch, getState) => {
	dispatch({type: 'SET_LEGACY_EVENTS', data: events});
};