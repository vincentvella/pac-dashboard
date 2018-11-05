export const setPendingEvents = events => (dispatch) => {
  dispatch({ type: 'SET_PENDING_EVENTS', data: events });
};

export const setLegacyEvents = events => (dispatch) => {
  dispatch({ type: 'SET_LEGACY_EVENTS', data: events });
};

export const setMobileEvents = events => (dispatch) => {
  dispatch({ type: 'SET_MOBILE_EVENTS', data: events });
}