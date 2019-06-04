import { normalize, schema } from 'normalizr';

const channelSchema = new schema.Entity('channels');
const channelListSchema = [channelSchema];

// eslint-disable-next-line import/prefer-default-export
export const channel = (data) => {
  if (data instanceof Array) {
    return normalize(data, channelListSchema);
  }
  return normalize([data], channelListSchema);
};
