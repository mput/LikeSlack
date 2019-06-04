import { normalize, schema } from 'normalizr';

const channelSchema = new schema.Entity('channels');
const channelListSchema = [channelSchema];

export const channels = (data) => {
  if (data instanceof Array) {
    return normalize(data, channelListSchema);
  }
  return normalize([data], channelListSchema);
};

const userSchema = new schema.Entity('users');
const userListSchema = [userSchema];

export const users = (data) => {
  if (data instanceof Array) {
    return normalize(data, userListSchema);
  }
  return normalize([data], userListSchema);
};