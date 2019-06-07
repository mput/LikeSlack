import { createSelector } from 'reselect';
import _ from 'lodash';


const channelsAllIds = state => state.channels.allIds;
const channelsById = state => state.channels.byId;
const channelsUIById = state => state.channels.UIbyId;


const channelsByIdWithUIState = createSelector(
  [channelsById, channelsUIById],
  (obj1, obj2) => _.merge({}, obj1, obj2),
);

export const channelsListSelector = createSelector(
  [channelsAllIds, channelsByIdWithUIState],
  (ids, byId) => ids.map(id => byId[id]),
);

export const activeChannelSelector = createSelector(
  channelsListSelector,
  channels => _.find(channels, { active: true }),
);

export const activeChannelIdSelector = createSelector(
  activeChannelSelector,
  activeChannel => (activeChannel ? activeChannel.id : null),
);


const allMessagesIds = state => state.messages.allIds;
const messagesById = state => state.messages.byId;

export const activeChannelMessages = createSelector(
  [allMessagesIds, messagesById, activeChannelIdSelector],
  (ids, byId, activeId) => ids
    .map(id => byId[id])
    .filter(message => message.channelId === activeId),
);


const usersById = state => state.users;
const meId = state => state.meId;
export const userMeSelector = createSelector(
  [usersById, meId],
  (byId, id) => byId[id],
);
