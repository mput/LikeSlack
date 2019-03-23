import { createSelector } from 'reselect';

const allChannelsIds = state => state.channels.allIds;
export const channelsById = state => state.channels.byId;

export const channelsSelector = createSelector(
  [allChannelsIds, channelsById],
  (ids, byId) => ids.map(id => byId[id]),
);
