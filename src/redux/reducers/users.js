const initialState = {
  model: {},
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, model: action.data };
    default:
      return state;
  }
};

export default users;
