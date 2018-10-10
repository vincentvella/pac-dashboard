const initialState = {
  model: {},
  authed: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, model: { ...state.model, ...action.data } };
    case 'AUTH_USER':
      return {
        ...state,
        authed: true,
      };
    case 'LOG_OUT':
      return {};
    default:
      return state;
  }
};

export default login;
