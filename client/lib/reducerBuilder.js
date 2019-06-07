import _ from 'lodash';

export const addEntitiesById = entityName => (state, action) => {
  const { payload: { entities } } = action;
  return { ...state, ...entities[entityName] };
};

export const addEntitiesAllIds = () => (state, action) => {
  const { payload: { result } } = action;
  return [...state, ...result.filter(id => !state.includes(id))];
};

export const addEntityAllIds = () => (state, action) => {
  const { payload: { result: id } } = action;
  return state.includes(id) ? state : [...state, id];
};

export const deleteEntityById = () => (state, { payload: id }) => _.omit(state, String(id));

export const deleteEntityAllId = () => (state, { payload: idToDel }) => state
  .filter(id => idToDel !== id);

export const updateEntityById = entityName => (state, action) => {
  const { payload: { entities } } = action;
  return _.merge({}, state, entities[entityName]);
};
