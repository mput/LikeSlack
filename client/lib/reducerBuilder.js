export const addEntitiesById = entityName => (state, action) => {
  const { payload: { entities } } = action;
  return { ...state, ...entities[entityName] };
};

export const addEntitiesAllIds = () => (state, action) => {
  const { payload: { result } } = action;
  return [...state, ...result.filter(id => !state.includes(id))];
};
