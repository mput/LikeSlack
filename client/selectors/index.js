import { createSelector } from 'reselect';

const allChannelsIds = state => state.channels.allIds;
const channelsById = state => state.channels.byId;

export const channelsSelector = createSelector(
  [allChannelsIds, channelsById],
  (ids, byId) => ids.map(id => byId[id]),
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

const usersById = state => state.users.byId;
const userMeId = state => state.ui.userMeId;
export const userMeSelector = createSelector(
  [usersById, userMeId],
  (byId, id) => byId[id],
);
