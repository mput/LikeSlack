import { createSelector } from 'reselect';

const channelsAllIds = state => state.channels.allIds;
const channelsById = state => state.channels.byId;
const channelsUIById = state => state.channels.UIbyId;

export const channelsSelector = createSelector(
  [channelsAllIds, channelsById, channelsUIById],
  (ids, byId, UIbyId) => ids.map(id => ({ ...byId[id], ...UIbyId[id] })),
);


const allMessagesIds = state => state.messages.allIds;
const messagesById = state => state.messages.byId;
export const activeChannelIdSelector = state => state.ui.activeChannelId.activeId;

export const activeChannelMessages = createSelector(
  [allMessagesIds, messagesById, activeChannelIdSelector],
  (ids, byId, activeId) => ids
    .map(id => byId[id])
    .filter(message => message.channelId === activeId),
);

export const activeChannel = createSelector(
  [channelsById, activeChannelIdSelector],
  (byId, id) => byId[id],
);

const usersById = state => state.users;
const meId = state => state.meId;
export const userMeSelector = createSelector(
  [usersById, meId],
  (byId, id) => byId[id],
);
