const initialState = {
  model: {
    pending: {},
    legacy: {},
  },
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PENDING_EVENTS':
      return { ...state, model: { ...state.model, pending: action.data } };
    case 'SET_LEGACY_EVENTS':
      return { ...state, model: { ...state.model, legacy: action.data } };
    case 'SET_MOBILE_EVENTS':
      return { ...state, model: { ...state.model, mobile: action.data } };
    default:
      return state;
  }
};

export default events;
