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


const messagesById = state => state.messages.byId;

export const activeChannelMessagesSelector = createSelector(
  [messagesById, activeChannelIdSelector],
  (byId, activeId) => Object.keys(byId)
    .map(id => byId[id])
    .filter(message => message.channelId === activeId)
    .sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt))),
);

export const oldestActiveChannelMessageSelector = createSelector(
  activeChannelMessagesSelector,
  (messages) => {
    if (messages.length === 0) {
      return null;
    }
    return messages[0];
  },
);


export const usersByIdSelector = state => state.users;
export const meIdSelector = state => state.ui.meId;
export const userMeSelector = createSelector(
  [usersByIdSelector, meIdSelector],
  (byId, id) => byId[id],
);
