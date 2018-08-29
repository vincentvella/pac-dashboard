const initialState = {
	model: {
		pending: {}
	},
};

const events = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_PENDING_EVENTS':
			return {...state, model: {...state.model, pending: action.data}};
		default:
			return state;
	}
};

export default events;