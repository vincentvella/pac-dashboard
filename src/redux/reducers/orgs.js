const initialState = {
  model: {},
};

const orgs = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORGS':
      return {...state, model: action.data};
    default:
      return state;
  }
};

export default orgs;