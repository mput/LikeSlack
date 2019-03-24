import { createSelector } from 'reselect';

const allChannelsIds = state => state.channels.allIds;
const channelsById = state => state.channels.byId;

export const channelsSelector = createSelector(
  [allChannelsIds, channelsById],
  (ids, byId) => ids.map(id => byId[id]),
);


const allMessagesIds = state => state.messages.allIds;
const messagesById = state => state.messages.byId;
const activeChannelId = state => state.activeChannelId;

export const activeChannelMessages = createSelector(
  [allMessagesIds, messagesById, activeChannelId],
  (ids, byId, activeId) => ids
    .map(id => byId[id])
    .filter(message => message.channelId === activeId),
);
